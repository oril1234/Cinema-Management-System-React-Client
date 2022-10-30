
//This service is for API calls related
import axios from "axios";

const baseURL="http://10.0.0.14:5000/users"

//Fetch all the users from server
const getUsers=()=>
{
    return axios.get(baseURL)
}

//Add new user to server
const addUser=(user)=>
{
    return axios.post(baseURL,user)
}

//Updating user details in server
const editUser=(user)=>
{
    return axios.put(baseURL+"/"+user.user_details.id,
    user)
}

//Delete user from server
const deleteUser=(user_id)=>
{
    return axios.delete(baseURL+"/"+user_id)
}


export default {getUsers,addUser,editUser,deleteUser}

