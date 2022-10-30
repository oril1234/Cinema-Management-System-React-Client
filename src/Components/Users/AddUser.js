import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Grid, Paper, Avatar, Typography, TextField, Button, FormGroup } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Checkbox, FormControlLabel } from '@mui/material';
import usersSvr from '../../services/Users_service';
import InfoDialogue from '../DialoguePopUps/InfoPopup';

//This component is for adding user data
export default function AddUserComp(componentProps) {
    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }

    //The default values of the add user form
    const initValues = {

        //User first name
        firstName: "",

        //User last name
        lastName: "",

        //user name
        username: "",

        //Number of minutes a user is allowed to stay connection to the app
        sessionTimeout: 0,

        //The date the user is created
        createDate: getDate(),

        //Actions the new user is allowrd to do
        permissions: []
    }

    /*
    All possible actions the user is allowed to do regarding movies 
    in the system
    */
    const movies_permissions = [
        "View Movies",
        "Create Movies",
        "Delete Movies",
        "Update Movies"
    ]

    /*
    All possible actions the user is allowed to do regarding members
    in the system
    */
    const members_permissions = [
        "View Members",
        "Create Members",
        "Delete Members",
        "Update Members"
    ]



    //All possible acctions user is allowed to do
    const user_permissions = [
        ...members_permissions,
        ...movies_permissions
    ]

    //Hook to update redux user reducer
    const dispatch = useDispatch()

    //When true success of adding new user displays
    const [showPopup, setShowPopup] = useState(false)

    //Details tp be displayed in the success pop up after new user 
    //is added
    const [popUpDetails, setPopUpDetails] = useState({
        title: "",
        content: "",
        closeFunction: null

    }
    )

    //Yup validation of add user formik form
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(3, "It's too short").required("Required"),
        lastName: Yup.string().min(3, "It's too short").required("Required"),
        username: Yup.string().email("Enter valid email").required("Required"),
        sessionTimeout: Yup.number().required("Required"),
        createDate: Yup.string().typeError("Enter valid Phone Number").required('Required'),
    })

    //Invoked when ever a change is made in the permissions field
    // of add user forms
    const handlePermissionsChange = (props, event) => {

        let perms = props.values.permissions
        let value = event.target.value
        if (event.target.checked) {
            perms.push(value)

            /*
            The next 2 if's are due to the fact the user must have the
            permission to view movies/members in order to be able
            to create, delete and update them
            */
            if (movies_permissions.includes(value)
                && value != "View Movies"
                && !perms.includes("View Movies")
                )
                    perms.push("View Movies")

            if (members_permissions.includes(value)
                && value != "View Members"
                && !perms.includes("View Members"))
                    perms.push("View Members")

            props.setFieldValue("permissions", perms)
            return
        }


        perms = perms.filter(perm => perm !== value)

        /*
        Executed if user permission to view movies/sibscriptions
        is canceled, because a user can't create, delete and update
        movies/sibscriptions unless he's able to view the them
        */
        if(value=="View Movies")
            perms = perms.filter(perm =>
                 !movies_permissions.includes(perm))

        if(value=="View Members")
            perms = perms.filter(perm =>
                !members_permissions.includes(perm))
        
        props.setFieldValue("permissions", perms)

    }


    //Invokded when add user form is submitted
    const onSubmit = async (values, props) => {
        props.setSubmitting(false)

        let user_to_add = {}
        user_to_add["user_details"] = { ...values }
        user_to_add["permissions"] =
            user_to_add["user_details"]["permissions"]
        delete user_to_add["user_details"]["permissions"]
        user_to_add["authentication"] = {}
        user_to_add["authentication"]["username"] =
            user_to_add["user_details"]["username"]

        addUser(user_to_add)
    }

    //Add user to server and redux reducer
    const addUser = async (user_to_add) => {
        try {

            //Add user to server
            let resp = await usersSvr.addUser(user_to_add)

            //Executed if adding user succeeded
            if (resp.status === 200) {
                user_to_add["user_details"]["id"] = resp.data
                user_to_add["permissions"]["id"] = resp.data

                //Adding user to redux reducer
                dispatch({ type: "ADD_USER", payload: user_to_add })

                //Preparing data to display in successfull add pop up
                openInfoDialogue(user_to_add)
            }
        } catch (err) {
        }
    }

    //Invoked in order to display the success pop after user was added
    const openInfoDialogue = (user) => {
        setPopUpDetails({
            ...popUpDetails, title: "Successfull Add",
            content: user["user_details"]["firstName"] + " " +
                user["user_details"]["lastName"] + " was successfully added.",
            closeFunction: componentProps.addUser
        })
        setShowPopup(true)
    }

    //Function to retreive the currrent date in the format of dd/mm/yyyy
    function getDate() {
        //Formattig the date according to dd/mm/yyyy pattern
        let date = new Date()
        let d = String(date.getDate())
        let m = String(date.getMonth() + 1)
        let y = date.getFullYear()
        return `${d}/${m}/${y}`
    }



    return (
        <Grid>

            <Paper elevation={10} style={paperStyle}>
                <Grid align='center' mb={3}>
                    <Avatar style={avatarStyle}>
                        <AddCircleOutlineOutlinedIcon />
                    </Avatar>
                    <h2 style={headerStyle}>Add User</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                <Formik initialValues={initValues} validationSchema={validationSchema}
                    onSubmit={onSubmit} enableReinitialize
                >

                    {(props) => (
                        <Form>

                            <Field as={TextField} fullWidth name="firstName" label='First Name'
                                helperText={<ErrorMessage style={{ color: 'red' }} name="firstName" />} />
                            <Field as={TextField} fullWidth name="lastName" label='Last Name'
                                placeholder="Enter your last name" helperText={<ErrorMessage name="lastName" />} />
                            <Field as={TextField} fullWidth name="username" label='User Name'
                                helperText={<ErrorMessage name="username" />} />
                            <Field type="number" as={TextField} fullWidth name="sessionTimeout" label='Session Timeout'
                                placeholder="Enter SessionTimeout" helperText={<ErrorMessage name="sessionTimeout" />} />
                            <Field as={TextField} fullWidth name="createDate" label='Create Date'
                                disabled />
                            <FormGroup>
                                {user_permissions?.map((permission, index) => (
                                    <Field
                                        onChange={(e) => { handlePermissionsChange(props, e) }}

                                        as={FormControlLabel}
                                        key={index}
                                        name="permissions"
                                        value={permission}

                                        control={
                                            <Checkbox
                                                checked=
                                                {props.values.permissions.includes(permission)} />
                                        }
                                        label={permission}
                                    />
                                ))}
                            </FormGroup>


                            <Grid>
                                <Button type='submit'
                                    variant='contained' disabled={props.isSubmitting}
                                    color='primary'>{props.isSubmitting ? "Loading" : "Add"}</Button>
                                <Button type='button'
                                    onClick={() => componentProps.addUser(false)}
                                    variant='contained' disabled={props.isSubmitting}
                                    color='error'>Cancel</Button>
                            </Grid>

                        </Form>
                    )}
                </Formik>
                {showPopup &&
                    <InfoDialogue popUpDetails={popUpDetails} />}
            </Paper>
        </Grid>
    )
}
