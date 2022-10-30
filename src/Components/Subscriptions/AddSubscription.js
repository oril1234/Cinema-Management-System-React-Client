import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper, TextField, Button, Select, MenuItem } from '@mui/material'
import { Formik, Field, Form, } from 'formik'
import * as Yup from 'yup'
import subsSvr from '../../services/Subscriptions_service';
import InfoDialogue from '../DialoguePopUps/InfoPopup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


//This component is for adding new
export default function AddSubComp(componentProps) {
    //Component styles
    const paperStyle = { padding: 20, margin: "2%" }


    //All the possible movies to subsctibe to
    const [movies, setMovies] = useState(new Map())

    //All the movies in the system
    const moviesReducerData = useSelector(state => state.moviesReducer)
    
    useEffect(() => {

        //Loading the data of all the movies in the system
        setMovies(moviesReducerData.movies)
    }, [])


    //Form default values
    const initValues = {

        //Movie ID
        movieID: "",
        date: new Date()

    }

    //Hook for updating the reducer when edit movie form is suubmitted
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


    //The schema by thich the formik form is validated
    const validationSchema = Yup.object().shape({
        movieID: Yup.string().min(3, "It's too short").required("Required"),
        date:Yup.date().required()
    })

    //Function to retreive the string of given date in the format of dd/mm/yyyy
    function getDate(date_arg) {
        //Formattig the date according to yyyy-mm-dd pattern
        let date = new Date(date_arg)
        let d = String(date.getDate())
        let m = String(date.getMonth() + 1)
        let y = date.getFullYear()
        return `${y}-${m}-${d}`
    }


    //Handling submit of add movie form
    const onSubmit = async (values, props) => {
        
        props.setSubmitting(false)
        let sub_to_add = { ...values }
        sub_to_add["memberID"]=componentProps.memberData["_id"]
        sub_to_add['date']=getDate(sub_to_add['date'])
        try {

            //Updating movie in server
            let resp = await subsSvr.addSubscription(sub_to_add)

            //Executed if movie update in server succeeded
            if (resp.status == 200) {
        
                sub_to_add["memberName"]=
                    componentProps["memberData"]["name"]
                sub_to_add["movieName"]=movies.get(sub_to_add["movieID"])["name"]
                //Update subscription in redux reducers
                dispatch({ type: "ADD_MEMBER_SUB", payload: sub_to_add })
                dispatch({ type: "ADD_MOVIE_SUB", payload: sub_to_add })

                //Preparing data to display in update pop up
                openInfoDialogue(sub_to_add)
            }
        } catch (err) {
            alert(err.response.data)
        }


    }


    //Invoked in order to display the success pop after adding subscriptions
    const openInfoDialogue = (sub) => {
        setPopUpDetails({
            ...popUpDetails, title: "Successfull Add",
            content: "Subscription to the movie " + sub["movieName"] +
             " for " + sub["memberName"] +
                " was successfully added",
            closeFunction: componentProps.changeAddSubState
        })
        setShowPopup(true)

    }

    return (
        <Grid>

            <Paper sx={{ border: 1 }} style={paperStyle}>

                {movies != undefined && <Formik initialValues={initValues} validationSchema={validationSchema}
                    onSubmit={onSubmit} enableReinitialize
                >

                    {(props) => (
                        <Form>

                            <Field name="movieID" as={Select} fullwidth
                                onChange={(e) => {
                                    props.setFieldValue("movieID", e.target.value)
                                }}>
                                {movies.size>0 &&
                                Array.from(movies.values()).map((movie) => {
                                    return (<MenuItem key={movie["_id"]}
                                        value={movie["_id"]}>
                                        {movie["name"]}
                                    </MenuItem>)
                                }

                                )}
                            </Field>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    onChange={(value) => props.setFieldValue("date", value)}
                                    value={props.values.date}
                                    inputFormat='DD/MM/YYYY'


                                    renderInput={(params) => (

                                        <TextField

                                            label="Subscription Date"
                                            margin="normal"
                                            name="date"
                                            variant="standard"
                                            fullWidth
                                            {...params}
                                        />
                                    )}
                                />
                            </LocalizationProvider>




                            <Grid>
                                <Button type='submit'
                                    variant='contained' disabled={props.isSubmitting}
                                >{props.isSubmitting ? "Loading" : "Subscribe"}</Button>

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
