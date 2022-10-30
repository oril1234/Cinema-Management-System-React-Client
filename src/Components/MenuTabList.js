
import {Button, Tab, Tabs } from '@mui/material'
import {useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from "react-router-dom";


/*
Component that is using tabs switches between different pages
that are only allowed to logged in users
*/
export default function MenuTabListComp() {

  //Navigation hook
  const navigate = useNavigate()

  /*
  The current value of the tab denoting the current page that
  is being displayed
  */
  const [value, setValue] = useState(false)

  //Data of logged in user from redux
  const authRedData=useSelector(state=>state.authReducer)
  

  useEffect(() => {
    
    
    let url = window.location.href
    
    /*
    Setting the tab of the current page to be displayed
    based on the utl as long as a specific page was routed,
    meaning the url doesn't just end with menu, but 
    menu/something
    */
    if (!url.endsWith("menu")) {
      let last_slash_idx=url.lastIndexOf("/")
      setValue(url.substring(last_slash_idx,url.length))
    }

    
  }, [authRedData])




  //Invoked when tab is switched in order to display the relevant page
  const handleChange = (e, val) => {
    
    if(val==value)
      return
    setValue(val)
    let value_without_slash = val.substring(1, val.length)
    
    navigate(value_without_slash)
  }
  return (

    <div >
      <Tabs value={value} onChange={handleChange}>
        { authRedData.loggedInUser["permissions"].
          includes("Manage Users") &&
          <Tab label="USERS MANAGEMENT" value="/users" component={Button} />}
        { authRedData.loggedInUser["permissions"].
            includes("View Members") &&
          <Tab label="SUBSCRIPTIONS" value="/subscriptions" component={Button} />}
        
        { authRedData.loggedInUser["permissions"].
            includes("View Movies") &&
          <Tab label="Movies" value="/movies" component={Button} />}
      </Tabs>
      <Outlet />



    </div>

  );
}