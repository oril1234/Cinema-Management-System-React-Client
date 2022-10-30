
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import AllMembersComp from './AllMembers'
import EditMemberComp from './EditMember'
import AddMemberComp from './AddMember'
import { useSelector } from 'react-redux'

/*
Component to switch between 3 pages of members:
1. All members and their details
2. Edit a specific member details
3. Adding new member
*/
export const MembersTabListComp = () => {

    //Details of the user currently logged in
    const authRedData = useSelector(state => state.authReducer)


    //The current value denotes the tab that is being displayed
    const [value, setValue] = useState("All Members")


    //Invoked when the current tab is changed
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    /*
    Function to move to edit member page existing from it according to the
    argument. 3 denotes Edit state 
    */
    const changeEditMemberState = (state) => {
        if (state)
            setValue("Edit Member")
        else
            setValue("All Members")
    }


    return (
        <Box>
            <h2>Members</h2>

            <TabContext value={value} >
                {/*If tab value is not 3 (Edit mode) tabs will be displayed */}
                {value != "Edit Member" && <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                    <TabList aria-label='Tabs examle'
                        onChange={handleChange}>

                        <Tab label="All Members" value="All Members" />
                        {/*User can add member to the system 
                        as long as he has the right permissions */}
                        {authRedData.loggedInUser["permissions"].
                            includes("Create Members") &&
                        <Tab label="Add Member" value="Add Member" />}


                    </TabList>
                </Box>}

                <TabPanel children={<AllMembersComp
                    editMember={changeEditMemberState} />}
                    value="All Members">

                </TabPanel>

                <TabPanel children={<AddMemberComp
                    toggleEdit={changeEditMemberState} />}
                    value="Add Member">

                </TabPanel>

                <TabPanel 
                    value="Edit Member"
                    children={<EditMemberComp
                    toggleEdit={changeEditMemberState} />}
                    >
                </TabPanel>
            </TabContext>

        </Box>
    )
}
