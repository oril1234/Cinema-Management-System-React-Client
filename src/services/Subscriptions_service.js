
//This sevice is for API calls related to subscriptions to movies
import axios from "axios";
const baseURL="http://10.0.0.14:5000/subscriptions"

//Fetching all the subscriptions
const getSubscriptions=()=>
{
    return axios.get(baseURL)
}

//Add new subscription
const addSubscription=(subscription)=>
{
    return axios.post(baseURL,subscription)
}




export default {getSubscriptions,addSubscription}

