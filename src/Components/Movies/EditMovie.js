import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Paper, Avatar, Typography, TextField, Button, FormHelperText, FormGroup } from '@mui/material'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Checkbox, FormControlLabel } from '@mui/material';
import moviesSvr from '../../services/Movies_service';
import InfoDialogue from '../DialoguePopUps/InfoPopup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


//This component is for updating movie data
export default function EditMovieComp(componentProps) {
    //Component styles
    const paperStyle = { padding: 20, width: 300, margin: "0 auto" }
    const headerStyle = { margin: 0 }
    const avatarStyle = { backgroundColor: '#1bbd7e' }


    //False until movie is fetched from redux
    const [displayForm, setDisplayForm] = useState(false)

    //Form values of the edited movie fetched from redux
    const [formValues, setFormValues] = useState(null)

    //Form default values
    const initValues = {

        //Edited movie name
        name: "",


        //Edited movie image url
        image: "",

        //Edited movie premiere date
        premiered: new Date(),


        //All possible generes of a movie
        genres: [

            "Drama",
            "Action",
            "Thriller",
            "Comedy",
            "Horror",
            "Science-Fiction",
            "Crime",
            "Romance",
            "Adventure",
            "Espionage",
            "Mystery",
            "Supernatural",
            "Fantasy",
            "Family",
            "Anime",
            "History",
            "Medical",
            "Legal",
            "Music",
            "Western",
            "War",
            "Sports"

        ]
    }

    //Redux movies reducer from which edited movie data is fetched
    const moviesDataReducer = useSelector(state => state.moviesReducer)

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

    //Fetch edited movie from redux reducer
    useEffect(
        () => {

            //Id of edited movie
            let movie_id = sessionStorage["movie_id"]
            

            //The edited movie object from redux according to id
            let found_movie = moviesDataReducer.movies.get(movie_id)
            //Executed if movie is not found
            if (found_movie == undefined)
                return
            
            found_movie["premiered"]=new Date(found_movie["premiered"])
            //Setting the form values to display
            setFormValues(found_movie)

            setDisplayForm(true)
        }, []
    )

    //The schema by thich the formik form is validated
    const validationSchema = Yup.object().shape({
        name: Yup.string().min(3, "It's too short").required("Required"),
        image: Yup.string().min(3, "It's too short").required("Required"),
        premiered: Yup.date("Invalud date").required('Required'),
        genres: Yup.array()
    })

    //Function to retreive the string of given date in the format of dd/mm/yyyy
    function getDate(date_arg)
    {
                //Formattig the date according to yyyy-mm-dd pattern
                let date=new Date(date_arg)
                let d=String(date.getDate())
                let m=String(date.getMonth()+1)
                let y=date.getFullYear()
                return `${y}-${m}-${d}`
    }


    //Handling submit of edit movie form
    const onSubmit = async (values, props) => {

        props.setSubmitting(false)
        let movie_to_update = { ...values }
        movie_to_update['premiered']=getDate(movie_to_update['premiered'])

        try {

            //Updating movie in server
            let resp = await moviesSvr.editMovie(movie_to_update)

            //Executed if movie update in server succeeded
            if (resp.status == 200) {
                

                //Update movie in redux
                dispatch({ type: "UPDATE_MOVIE", payload: movie_to_update })

                //Preparing data to display in update pop up
                openInfoDialogue(movie_to_update)
            }
        } catch (err) {
            alert(err.response.data)
        }


    }


    //Invoked in order to display the success pop after movie was updated
    const openInfoDialogue = (movie) => {
        setPopUpDetails({
            ...popUpDetails, title: "Successfull Edit",
            content: "The movie " + movie["name"] + " " +
                " with id " + movie["_id"] +
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
                    <h2 style={headerStyle}>Edit Movie</h2>
                </Grid>
                {displayForm && <Formik initialValues={formValues || initValues} validationSchema={validationSchema}
                    onSubmit={onSubmit} enableReinitialize
                >

                    {(props) => (
                        <Form>

                            <Field as={TextField} fullWidth name="name" label='Movie Name'
                                helperText={<ErrorMessage name="name" />} />
                            <Field as={TextField} fullWidth name="image" label='Movie Image'
                                placeholder="Enter movie image url" helperText={<ErrorMessage name="image" />} />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    onChange={(value) => props.setFieldValue("premiered", value)}
                                    value={props.values.premiered}
                                    inputFormat='DD/MM/YYYY'
                                    disabled
                                    
                                    renderInput={(params) => (
                                        
                                        <TextField
                                        
                                            label="premiered"
                                            margin="normal"
                                            name="premiered"
                                            variant="standard"
                                            fullWidth
                                            {...params}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            <FormGroup>
                                {initValues.genres?.map((genre, index) => (
                                    <Field
                                        onChange={props.handleChange}

                                        as={FormControlLabel}
                                        key={index}
                                        name="genres"
                                        value={genre}

                                        control={
                                            <Checkbox
                                                checked=
                                                {props.values.genres.includes(genre)} />
                                        }
                                        label={genre}
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
