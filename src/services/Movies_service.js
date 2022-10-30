
//This service is for API calls related to movies
import axios from "axios";

const baseURL="http://10.0.0.14:5000/movies"

//Fetch movies from server
const getMovies=()=>
{
    return axios.get(baseURL)
}

//Add new movie to server
const addMovie=(movie)=>
{
    return axios.post(baseURL,movie)
}

//Updating a movie in the server
const editMovie=(movie)=>
{
    return axios.put(baseURL+"/"+movie._id,
    movie)
}


//Delete a movie from server
const deleteMovie=(movie_id)=>
{
    return axios.delete(baseURL+"/"+movie_id)
}


export default {getMovies,addMovie,editMovie,deleteMovie}

