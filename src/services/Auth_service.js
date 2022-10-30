/**
 This service is for API calls related to authentication
 */

import axios from "axios";


const baseURL="http://10.0.0.14:5000/auth"

//Function to login to system
const login=(credentials)=>
{
    return axios.post(baseURL+"/login",credentials)
}

//Function to fetch data of user that logged in
const get_logged_in_user_data=()=>
{
    return axios.get(baseURL+"/logged_in_user")
}

//Function to sign up and create a new account
const signup=(credentials)=>
{
    return axios.post(baseURL+"/signup",credentials)
}


/*
Function to store JWT in session storage after user logged in successfully
*/
const saveToken=(token)=>
{
    sessionStorage["token"]=token
}

//Get JWT 
const getToken=()=>
{
    return sessionStorage["token"]
}

//logout of user from system by deleting JWT
const logout=()=>
{
    sessionStorage.removeItem("token")
}

export default {login,get_logged_in_user_data,
    signup,saveToken,getToken,logout}