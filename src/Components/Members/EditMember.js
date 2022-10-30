import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper, Avatar,TextField, Button } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import membersSvr from '../../services/Members_service';
import InfoDialogue from '../DialoguePopUps/InfoPopup';


//This component is for updating member data
export default function EditMemberComp(componentProps) {
    //Component styles
    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }


    //False until member is fetched from redux
    const [displayForm, setDisplayForm] = useState(false)

    //Form values of the edited member fetched from redux
    const [formValues, setFormValues] = useState(null)

    //Form default values
    const initValues = {

        //Edited member name
        name: "",


        //Edited member email
        email: "",

        //Edited member city
        city: "",
    }

    //Redux members reducer from which edited member data is fetched
    const membersDataReducer = useSelector(state => state.membersReducer)

    //Hook for updating the reducer when edit member form is suubmitted
    const dispatch = useDispatch()

    //When true success pop up displays
    const [showPopup, setShowPopup] = useState(false)

    //Title, content and function sent to popup when displayed
    const [popUpDetails, setPopUpDetails] = useState({
        title: "",
        content: "",
        closeFunction: null,

    }
    )

    //Fetch edited member from redux reducer
    useEffect(
        () => {

            //Id of edited member
            let member_id = sessionStorage["member_id"]

            //The edited member object from redux according to id
            let found_member = membersDataReducer.members.get(member_id)
            //Executed if member is not found
            if (found_member == undefined)
                return
            
            //Setting the form values to display
            setFormValues(found_member)

            setDisplayForm(true)
        }, []
    )

    //The schema by thich the formik form is validated
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        email: Yup.string().min(3, "It's too short").
        email("Please enter a valid email").
        required("Required"),
        city: Yup.string().min(3, "It's too short").required("Required")
        
    })


    //Handling submit of edit member form
    const onSubmit = async (values, props) => {

        props.setSubmitting(false)
        let member_to_update = { ...values }

        try {

            //Updating member in server
            let resp = await membersSvr.editMember(member_to_update)

            //Executed if member update in server succeeded
            if (resp.status == 200) {

                //Update member in redux
                dispatch({ type: "UPDATE_MEMBER", payload: member_to_update })

                //Preparing data to display in update pop up
                openInfoDialogue(member_to_update)
            }
        } catch (err) {
            alert(err.response.data)
        }


    }


    //Invoked in order to display the success pop after member was updated
    const openInfoDialogue = (member) => {
        setPopUpDetails({
            ...popUpDetails, title: "Successfull Edit",
            content: "The member " + member["name"] + " " +
                " with id " + member["_id"] +
                " has been successfully edited",
            closeFunction: componentProps.toggleEdit
        })
        setShowPopup(true)

    }

    return (
        <Grid>

            <Paper elevation={10} style={paperStyle}>
                <Grid align='center' mb={3} >
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Edit Member</h2>
                </Grid>
                {displayForm && <Formik initialValues={formValues || initValues} validationSchema={validationSchema}
                    onSubmit={onSubmit} enableReinitialize
                >

                    {(props) => (
                        <Form>

                            <Field as={TextField} fullWidth name="name" label='Member Name'
                                helperText={<ErrorMessage name="name" />} />
                            <Field as={TextField} fullWidth name="email" label='Email'
                                placeholder="Enter member email" helperText={<ErrorMessage name="email" />} />
                            <Field as={TextField} fullWidth name="city" label='City'
                                placeholder="Enter member city" helperText={<ErrorMessage name="city" />} />


                            <Grid>
                                <Button type='submit'
                                    variant='contained' disabled={props.isSubmitting}
                                    color='primary'>{props.isSubmitting ? "Loading" : "Edit"}</Button>
                                <Button type='button'
                                    onClick={() => componentProps.toggleEdit(false)}
                                    variant='contained' disabled={props.isSubmitting}
                                    color='error'>Cancel</Button>
                            </Grid>

                        </Form>
                    )}
                </Formik>}
                {showPopup && <InfoDialogue
                    popUpDetails={popUpDetails} />}
            </Paper>
        </Grid>
    )
}
