import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import ConfirmDialogue from '../DialoguePopUps/ConfirmPopup';
import { useDispatch, useSelector } from 'react-redux';
import MembersSubscriptionsComp from './Members_Subscriptions';

//Component of a member details
export default function MomberComp(props) {

  //Reducer with the data of the user currenly logged in
  const authRedData = useSelector(state => state.authReducer)

  //When true, pop up to ask user if he wishes to delete member displays
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
      title: "Delete Member",
      content: `You are about to delete 
      ${props.memberData.name}. Are you sure you want 
      to delete?`,
      confirmFunction: deleteMember,
      cancelFunction: closePopup

    })
    setShowDeletePopup(true)
  }

  //Function to close the delete pop up
  const closePopup = () => {
    setShowDeletePopup(false)
  }

  //Function to delete member
  const deleteMember = () => {
    setShowDeletePopup(false)
    props.deleteMember(props.memberData._id)
  }

  //Function to edit member
  const editMember = () => {
    sessionStorage["member_id"] = props.memberData._id
    props.editMember(true)
  }



  return (
    <Card sx={{ maxWidth: 345, mb: '2%' }}>

      <CardContent align='left'>
        <Typography component={'span'} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={12}>
              <label><strong>{props.memberData.name + ":"}</strong></label>
            </Grid>

          </Grid>
        </Typography>

        <Typography component={'span'} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>Email:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.memberData.email}</label>
            </Grid>
          </Grid>
        </Typography>
        <Typography component={'span'} sx={{ mb: 1.5 }} color="text.secondary">
          <Grid container spacing={1}>
            <Grid item sm={6}>
              <label><strong>City:{' '}</strong></label>
            </Grid>
            <Grid item sm={6}>
              <label>{props.memberData.city}</label>
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
      <CardActions>
        {/* User Can edit amember if has the right permission */}
        {authRedData.loggedInUser.permissions.includes("Update Members") &&
          <Button
            onClick={() => editMember()}
            variant='contained'
            size="small">
            Edit
          </Button>}

         {/* User Can delete amember if has the right permission */}
        {authRedData.loggedInUser.permissions.
          includes("Delete Members") &&
          <Button
          onClick={() => openPopup()}
          color='error' size="small">Delete</Button>}
      </CardActions>
      {showDeletePopup && <ConfirmDialogue popupDetails={popupDetails} />}
      
      {/*All the subscriptions of movies for this member */}
      <MembersSubscriptionsComp memberData={props.memberData} />
    </Card>

  );
}
