import { useEffect, useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import usersSvr from "../../services/Users_service"
import UserComp from "./User"

//Component for displaying all the users in the system
export default function AllUsersComp(props)
{

    //All the users in the system
    const [users,setUsers]=useState([])

    //Hook to fill users reducer with users data after fetched from server
    const dispatch=useDispatch()

    //Hook to fetch users data from redux if the if the reducer is not 
    //empty
    const usersReducerData=useSelector(state=>state.usersReducer)

    useEffect(()=>
    {
        setUsers(Array.from(usersReducerData.users.values())) 
    },[usersReducerData])


    //Function to delete user from server and redux
    const deleteUser=async (user_id)=>
    {
        await usersSvr.deleteUser(user_id)
        
        
        dispatch({ type: "DELETE_USER", payload: user_id })

    }

    return(
        <div>
            {
                users.map(
                    (user,index)=>
                    {
                        return(
                            <UserComp editUser={props.editUser}
                            deleteUser={deleteUser}
                            key={index}
                            userData={user}/>
                        )
                    }
                )
            }
            
        </div>
    )
}