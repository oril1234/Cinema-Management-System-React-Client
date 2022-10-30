import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from 'react-redux';
import authSvr from '../services/Auth_service';
import {useEffect} from 'react'

/*
Navigation bar component in which there's the log out button the
can press in order to log out and return to login page
*/
export default function NavbarComp() {
  const authReducerData=useSelector(state=>state.authReducer)
  const dispatch=useDispatch()



  const logout=()=>
  {
    authSvr.logout()
    dispatch({type:"LOGOUT"})
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed">
      <Toolbar>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        </Typography>
        {sessionStorage["token"]
         && <Button color="inherit" 
        onClick={()=>logout()}>Logout</Button>}
      </Toolbar>
    </AppBar>
  </Box>
  );
}
