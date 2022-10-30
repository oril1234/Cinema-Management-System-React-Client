import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ConfirmDialogue from '../DialoguePopUps/ConfirmPopup';
import MoviesSubscriptionsComp from './Movies_Subscriptions';
import { useSelector } from 'react-redux';

//Component of a movie details
export default function MovieComp(props) {

  //logged in user data from redux
  const authRedData=useSelector(state=>state.authReducer)
  //When true, pop up to ask user if he wishes to delete movie displays
  const [showDeletePopup, setShowDeletePopup] = useState(false)

  //Details to be sent to delete pop up
  const [popupDetails, setPopupDetails] = useState({
    title: "",
    content: "",
    confirmFunction: null,
    cancelFunction: null
  })

  //Function to set the details to be sent to delete pop up and then
  //displaying it
  const openPopup = () => {
    setPopupDetails({
      ...popupDetails,
      title: "Delete Movie",
      content: `You are about to delete 
      ${props.movieData.name}. Are you sure you want 
      to delete?`,
      confirmFunction: deleteMovie,
      cancelFunction: closePopup

    })
    setShowDeletePopup(true)
  }

  //Function to close the delete pop up
  const closePopup = () => {
    setShowDeletePopup(false)
  }

  //Function to delete movie
  const deleteMovie = () => {
    setShowDeletePopup(false)
    props.deleteMovie(props.movieData._id)
  }

  //Function to edit movie
  const editMovie = () => {
    sessionStorage["movie_id"] = props.movieData._id
    props.editMovie(true)
  }

  //Function to get the year of the premiere of the movie
  const getPremiereYear = () => {
    let premiere_data = new Date(props.movieData.premiered)
    return premiere_data.getYear() + 1900
  }

  return (
    <Card sx={{ maxWidth: 345, mb: '2%' }}>

      <CardContent align='left'>
        <Typography component={'span'} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={12}>
              <label><strong>{props.movieData.name + ", " + getPremiereYear()}</strong></label>
            </Grid>

          </Grid>
        </Typography>

        <Typography component={'span'} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Genres:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.movieData.genres.join(', ')}</label>
            </Grid>
          </Grid>

        </Typography>
        <Grid container >
          <Grid item xs={12} lg={3}
            style={{
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `url(${props.movieData.image})`, height: '100px'
            }}>
          </Grid>
          <Grid item xs={10} lg={9}>
            {showDeletePopup && <ConfirmDialogue popupDetails={popupDetails} />}
            <MoviesSubscriptionsComp movieData={props.movieData} />
          </Grid>

        </Grid>
      </CardContent>
      <CardActions>

      {/* User can edit movie as long as he has the right permission */}
      {authRedData.loggedInUser.permissions.includes("Update Movies") &&
          <Button
            onClick={() => editMovie()}
            variant='contained'
            size="small">
            Edit
          </Button>}

          {/* User can delete movie as long as he has the right permission */}
          {authRedData.loggedInUser.permissions.
          includes("Delete Movies") &&
          <Button
          onClick={() => openPopup()}
          color='error' size="small">Delete</Button>}
      </CardActions>


    </Card>

  );
}
