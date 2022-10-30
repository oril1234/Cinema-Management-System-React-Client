import { Button, List, ListItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AddSubComp from "../Subscriptions/AddSubscription";

/*
Component for displaying all the subscriptions made for a specific
user by a specific member
*/
export default function MembersSubscriptionsComp(props) {


    //Redux data of all the subsriptions of movies made by all the users
    const memberSubsReducerData = 
        useSelector(state => state.membersSubsReducer)

    //Redux data of all the movies in the system
    const moviesReducerData=useSelector(state=>state.moviesReducer)

    //All the subscriptions of the member
    const [subscriptions, setSubscriptions] = useState()

    //When true member subscriptions displays
    const [showData, setShowData] = useState(false)

    /*
    When true instance of adding new subscriptio for the member
    is displayed
    */
    const [showAddSubComp,setShowAddSubComp]=useState(false)

    /*
    Navigation hook used to navigate to the page of a specific movie
    if selected by the user within all the movies the member subscribed to
    */
    const navigate=useNavigate()
    useEffect(() => {

        /*
        Fetching from redux all the subscriptions made by a member his
        id came from the props
        */
        let subs = memberSubsReducerData.subs.get(props.memberData._id)
    
        //Executed if member has subscriptions
        if (subs != undefined) 
        {
            
            /*
            Iterating through all the movies the member subscribed to
            in order to display also the names of the movies
            */
            for(let i=0;i<subs.length;i++)
            {
                let movie_data=
                    moviesReducerData.movies.get(subs[i]["movieID"])
                subs[i]["movieName"]=movie_data["name"]
            }

            setSubscriptions(subs)
            setShowData(true)

        }

    }, [moviesReducerData,memberSubsReducerData])

    const changeAddSubState=(state)=>
    {
        setShowAddSubComp(state)
    }

    const showSpecificMovie=(movie_name)=>
    {
        sessionStorage["specific_movie"]=movie_name
        navigate("/menu/movies")
    }
    return (
        <Box sx={{ border: 1, px: 2, mx: 2 }}>
            <Typography ><strong>Movies Watched:</strong></Typography >

            {showData && <List
                sx={{
                    listStyleType: 'disc',
                    pl: 2,
                    '& .MuiListItem-root': {
                        display: 'list-item',
                    },
                }}>
                {
                    subscriptions.map((sub, index) => {
                        return (<ListItem key={index}>
                           <Button onClick={()=>showSpecificMovie(sub.movieName)}>{sub.movieName+","}</Button> {sub.date}
                        </ListItem>)
                    }

                    )}


            </List>}
            <Button
                onClick={() => setShowAddSubComp(!showAddSubComp)}
                variant='contained'
                color="secondary"
                size="small">
               {!showAddSubComp? 'Subscribe To New Movie':
               'Cancel New Subscription'}</Button>
            {/*The component used for adding new subscription for
            the member */}
           { showAddSubComp && 
           <AddSubComp memberData={props.memberData}
           changeAddSubState={changeAddSubState}/>}
        </Box>
    )

}