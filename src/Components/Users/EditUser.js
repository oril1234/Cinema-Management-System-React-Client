import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper, Avatar, Typography, TextField, Button, FormHelperText, FormGroup } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Checkbox, FormControlLabel } from '@mui/material';
import usersSvr from '../../services/Users_service';
import InfoDialogue from '../DialoguePopUps/InfoPopup';

//This component is for updating user data
export default function EditUserComp(componentProps) {
    //Component styles
    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }


    //False until user data is fetched from redux
    const [displayForm, setDisplayForm] = useState(false)

    //Form values of the edited user fetched from redux
    const [formValues, setFormValues] = useState(null)

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

    //Form default values
    const initValues = {
        //Edited user first name
        firstName: "",

        //Edited user last name
        lastName: "",

        //Edited user user name
        username: "",

        //Edited user password to login to the application
        password: "",

        /*
        The number of minutes a user is allowed to stay connected
        to the application
        */
        sessionTimeout: 0,

        //The date user has been created in the app by the admin
        createDate: "",

        //All the actions a user has authorization to do
        permissions: [
        ...members_permissions,
        ...movies_permissions

        ]
    }

    //Redux users reducer from which edited user data is fetched
    const usersDataReducer = useSelector(state => state.usersReducer)

    //Hook for updating the reducer when edit user form is suubmitted
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

    //Fetch edited user from redux reducer
    useEffect(
        () => {

            //Id of edited user
            let user_id = sessionStorage["user_id"]

            //The edited user object from redux according to id
            let found_user = usersDataReducer.users.get(user_id)

            //Executed if user is not found
            if (found_user == undefined)
                return


            found_user["user_details"]["username"] = found_user["authentication"]["username"]

            //Executed if user already created an account and set a password
            if (found_user["user_details"]["password"] != undefined)
                found_user["user_details"]["password"] =
                    found_user["authentication"]["password"]


            found_user["user_details"]["permissions"] = found_user["permissions"]

            //Setting the form values to display
            setFormValues(found_user["user_details"])

            setDisplayForm(true)
        }, []
    )

    //The schema by thich the formik form is validated
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(3, "It's too short").required("Required"),
        lastName: Yup.string().min(3, "It's too short").required("Required"),
        username: Yup.string().email("Enter valid email").required("Required"),
        sessionTimeout: Yup.number().required("Required"),
        createDate: Yup.string().typeError("Enter valid Phone Number").required('Required'),
        permissions: Yup.array()
    })

    //Invoked when permissions field in the form is changed
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

    //Invoked when edited user form is submitted in order to
    //organize the data object before sending it to server
    const onSubmit = async (values, props) => {
        props.setSubmitting(false)
        let user_to_update = {}
        user_to_update["user_details"] = { ...values }
        delete user_to_update["user_details"]["permissions"]
        user_to_update["authentication"] = {}
        user_to_update["authentication"]["username"] =
            user_to_update["user_details"]["username"]
        if (user_to_update["user_details"]["password"] != undefined)
            user_to_update["authentication"]["password"] =
                user_to_update["user_details"]["password"]
        delete user_to_update["user_details"]["password"]
        user_to_update["permissions"] = [...values.permissions]

        updateUser(user_to_update)

    }

    //Updating user in server and redux
    const updateUser = async (user_to_update) => {

        try {

             //Updating user in server
            let resp = await usersSvr.editUser(user_to_update)

            //Executed if user update in server succeeded
            if (resp.status == 200) {

                //Update user in redux
                dispatch({ type: "UPDATE_USER", payload: user_to_update })
                
                //Preparing data to display in update pop up
                openInfoDialogue(user_to_update)
            }
        } catch (err) {
            alert(err.response.data.error)
        }


    }


    //Invoked in order to display the success pop after user was updated
    const openInfoDialogue = (user) => {
        setPopUpDetails({
            ...popUpDetails, title: "Successfull Edit",
            content: user["user_details"]["firstName"] + " " +
                user["user_details"]["lastName"] + " with id " + user["user_details"]["id"] +
                " has been successfully edit",
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
                    <h2 style={headerStyle}>Edit User</h2>
                    <Typography variant='caption' gutterBottom>Please fill this form to create an account !</Typography>
                </Grid>
                {displayForm && <Formik initialValues={formValues || initValues} validationSchema={validationSchema}
                    onSubmit={onSubmit} enableReinitialize
                >

                    {(props) => (
                        <Form>

                            <Field as={TextField} fullWidth name="firstName" label='First Name'
                                helperText={<ErrorMessage name="firstName" />} />
                            <Field as={TextField} fullWidth name="lastName" label='Last Name'
                                placeholder="Enter your last name" helperText={<ErrorMessage name="lastName" />} />
                            <Field as={TextField} fullWidth name="username" label='User Name'
                                helperText={<ErrorMessage name="username" />} />
                            <Field as={TextField} fullWidth name="sessionTimeout" label='Session Timeout'
                                placeholder="Enter SessionTimeout" helperText={<ErrorMessage name="sessionTimeout" />} />
                            <Field as={TextField} fullWidth name="createDate" label='Create Date'
                                placeholder="Enter createDate" disabled />
                            <FormGroup>
                                {initValues.permissions?.map((permission, index) => (
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
