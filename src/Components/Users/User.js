import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import ConfirmDialogue from '../DialoguePopUps/ConfirmPopup';

//Component of a user details
export default function UserComp(props) {

  //When true, pop up to ask admin if he's he wishes to delete user displays
  const [showDeletePopup,setShowDeletePopup] = useState(false)

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
      title: "Delete User",
      content: `You are about to delete 
      ${props.userData.user_details.firstName} 
      ${props.userData.user_details.lastName}. Are you sure you want 
      to delete?`,
      confirmFunction: deleteUser,
      cancelFunction: closePopup

    })
    setShowDeletePopup(true)
  }

  //Function to close the delete pop up
  const closePopup = () => {
    setShowDeletePopup(false)
  }

  //Function to delete user
  const deleteUser = () => {
    setShowDeletePopup(false)
    props.deleteUser(props.userData.user_details.id)
  }

  //Function to edit user
  const editUser = () => {
    sessionStorage["user_id"] = props.userData.user_details.id
    props.editUser(true)
  }

  return (
    <Card sx={{ maxWidth: 345, mb: '2%' }}>

      <CardContent align='left'>
        <Typography component={"span"} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Name:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.userData.user_details.firstName + ' '
                + props.userData.user_details.lastName}</label>
            </Grid>
          </Grid>
        </Typography>
        <Typography component={"span"} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Username:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.userData.authentication.username}</label>
            </Grid>
          </Grid>

        </Typography>
        <Typography component={"span"} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Session Timeout (Minutes):{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.userData.user_details.sessionTimeout}</label>
            </Grid>
          </Grid>
        </Typography>
        <Typography  component={"span"}sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Create Date:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.userData.user_details.createDate}</label>
            </Grid>
          </Grid>
        </Typography>
        <Typography  component={"span"}sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Permissions:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.userData.permissions.join(', ')}</label>
            </Grid>
          </Grid>

        </Typography>
      </CardContent>
      <CardActions>
        <Button
          onClick={() => editUser()}
          variant='contained'
          size="small">
          Edit</Button>
        <Button
          onClick={() => openPopup()}
          color='error' size="small">Delete</Button>
      </CardActions>
      {showDeletePopup && <ConfirmDialogue popupDetails={popupDetails} />}
    </Card>

  );
}
