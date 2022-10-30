import { Button, List, ListItem } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MoviesSubscriptionsComp(props) {

    //Data from redux of all the subscriptions made to each movie
    const movieSubsReducerData = useSelector(state => state.moviesSubsReducer)
    
    //All the members in the system
    const membersReducerData = useSelector(state => state.membersReducer)
    
    //All the members that subscribed to the specific movie from props
    const [subscribers, setSubscribers] = useState()

    //If true subscribers are displayed
    const [showData, setShowData] = useState(false)

    /*
    Navigation hook to navigate to a specific subscriber details
    of the movie from props
    */ 
    const navigate=useNavigate()
    useEffect(() => {

        //All the subscriptions to this specific movie
        let subs = movieSubsReducerData.subs.get(props.movieData._id)

        if (subs != undefined) 
        {
           
            /*
            Ierating through all the thw subscriptions of this movie
            in order to attach to each one of them the subscriber name
            in order to be displayed
            */ 
            for (let i = 0; i < subs.length; i++) {

                let member_data =
                    membersReducerData.members.get(subs[i]["memberID"])
                subs[i]["memberName"] = member_data["name"]
                
            }

            setSubscribers(subs)
            setShowData(true)

        }
        else
            setShowData(false)

    }, [membersReducerData, movieSubsReducerData,props])

    /*
    Triggered in order to navigate to page of a specific subscriber
    to display all his data
    */
    const showSpecificMember=(member_id)=>
    {
        sessionStorage["specific_member_id"]=member_id
        navigate("/menu/subscriptions")
    }
    return (
        <Box sx={{ border: 1, px: 2, mb: 1 }}>
            <label><strong>Subscriptions Watched:</strong></label>
            {showData && <List
                sx={{
                    listStyleType: 'disc',
                    pl: 2,
                    '& .MuiListItem-root': {
                        display: 'list-item',
                    },
                }}>
                {
                    subscribers.map((sub, index) => {
                        return (<ListItem key={index}>
                            <Button onClick={()=>showSpecificMember(sub.memberID)}>
                                {sub.memberName +","}</Button> {sub.date}


                        </ListItem>)
                    }

                    )}
            </List>}
        </Box>
    )

}