
import { Box,Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {useState } from 'react'
import AllUsersComp from './AllUsers'
import EditUserComp from './EditUser'
import AddUserComp from './AddUser'

/*
Component to switch between 3 pages of users:
1. All users and their details
2. Edit a specific user details
3. Adding new user
*/
export const UsersTabListComp = () => {

    //The current value denotes the tab that is being displayed
    const [value, setValue] = useState("All Users")

    //Label of the tabs
    const values = ["All Users","Add User","Edit User"]

    //Invoked when the current tab is changed
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    /*
    Function to move to edit user page existing from it according to the
    argument. 3 denotes Edit state 
    */
    const changeEditUserState = (state) => {
        if (state)
            setValue("Edit User")
        else
            setValue("All Users")
    }


    return (
        <Box>
            <h2>Users</h2>

            <TabContext value={value} >
                {/*If tab value is not 3 (Edit mode) tabs will be displayed */}
                {value != "Edit User" &&
                 <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    
                        <TabList aria-label='Tabs exam[le'
                            onChange={handleChange}>
                            {

                                values.map((val, index) => {
                                    if (val == "Edit User")
                                        return
                                    return (
                                        <Tab
                                            style={{ fontSize: '12px' }}
                                            key={index}
                                            label={val}
                                            value={val} />
                                    )
                                })
                            }

                        </TabList>
                </Box>}

                <TabPanel children={<AllUsersComp
                    editUser={changeEditUserState} />} value='All Users'>

                </TabPanel>
                <TabPanel value='Add User'>
                    <AddUserComp
                    addUser={changeEditUserState}
                    />
                </TabPanel>
                <TabPanel
                    children={<EditUserComp
                        toggleEdit={changeEditUserState} />} value='Edit User'>
                </TabPanel>
            </TabContext>

        </Box>
    )
}
