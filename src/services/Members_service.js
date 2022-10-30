
//This service is for API calls related to members
import axios from "axios";

const baseURL="http://10.0.0.14:5000/members"

//Fetch members from server
const getMembers=()=>
{
    return axios.get(baseURL)
}

//Add new member to server
const addMember=(member)=>
{
    return axios.post(baseURL,member)
}

//Updating a member in the server
const editMember=(member)=>
{
    return axios.put(baseURL+"/"+member._id,
    member)
}


//Delete a member from server
const deleteMember=(member_id)=>
{
    return axios.delete(baseURL+"/"+member_id)
}


export default {getMembers,addMember,editMember,deleteMember}

