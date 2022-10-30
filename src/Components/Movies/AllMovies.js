import {CircularProgress, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import SearchBarComp from "../Search_Bar"
import moviesSvr from "../../services/Movies_service"
import MovieComp from "./Movie"
import MoviesPaginationComp from "./Pagination/Movies_Pagination"

//Component for displaying all the movies in the system
export default function AllMoviesComp(props) {

    //If true loading spinner is displayed
    const [loading, setLoading] = useState(true)
    //All the movies filtered by search query
    const [filteredMovies, setFilteredMovies] = useState([])

    //All the current page
    const [moviesInPage, setMoviesInPage] = useState([])
    //Hook to load movies reducer with movies data after fetched from server
    const dispatch = useDispatch()

    //Hook to fetch movies data from redux if the reducer is not 
    //empty
    const moviesReducerData = useSelector(state => state.moviesReducer)

    /*
    The initial search query by which movies are filtered.
    In the default state there's no search query, meaning all the movies
    are displayed.
    */
    const [initialSearchQuery, setInitialSearchQuery] = useState()

    //The total number of pages of the pagination component
    const [pagesNum, setPagesNum] = useState(10)

    //The number of pages displayed in each page
    const [moviesPerPage] = useState(10)

    //If true pagination component is displayed
    const [showPagination, setShowPagination] = useState(false)

    //Function to update mpvies displayed according to pagination
    const resetFunction = (movies_to_update, currentPage) => {
        if (movies_to_update == undefined)
            movies_to_update = [...filteredMovies]
        else
            setFilteredMovies(movies_to_update)

        //The index the last movie in the current movie    
        let index_of_last_movie = currentPage * moviesPerPage

        //THe index of first movie in the current page
        let index_of_first_movie = index_of_last_movie - moviesPerPage

        /*
        Out of all the movies the movies in current page
        according to the indices
        */
        let movies_in_current_page = [...movies_to_update.slice(index_of_first_movie,
            index_of_last_movie)]
        setMoviesInPage(movies_in_current_page)

        /*
        Determoning the total number of pages according to the number
        of all the movies
        */
        setPagesNum(Math.ceil(movies_to_update.length / moviesPerPage))
        
        /*
        Pagination will not display if total number of movies is not
        greater than the number of movies per page
        */ 
        if (movies_to_update.length > moviesPerPage)
            setShowPagination(true)
        else
            setShowPagination(false)

        setLoading(false)
    }

    useEffect(() => {

        //All the movies in the system
        let values = Array.from(moviesReducerData.movies.values())

        /*
        Exists if this component was reached from the page 
        of members and movies they subscribed to, and the logged in
        user clicked one of those movies saved in session storage
        */
        let specific_movie = sessionStorage["specific_movie"]

        if (specific_movie) {
            let filtered_movies = values.filter(
                movie => movie["name"] == specific_movie)
            sessionStorage.removeItem("specific_movie")

            if (filtered_movies != undefined) {
                /*
                Updating the filtered movies which is basically
                an array of all the movies, but in this case gets
                only the movie with the name stored in the session
                storage
                */
                setFilteredMovies(filtered_movies)

                //Updating pagination details
                resetFunction(filtered_movies, 1)

                /*
                Setting the value displayed in the search bar
                with the name of the movie from session storage 
                */
                setInitialSearchQuery(filtered_movies[0]["name"])
            }
        }
        else {

            /*
            Updating the filtered movies with all the possible movies
            as there's no specific movie to filter by
            */
            setFilteredMovies(values)

            //Updating pagination details
            resetFunction(values, 1)
        }


    }, [moviesReducerData])


    //Function to delete movie from server and redux
    const deleteMovie = async (movie_id) => {
        await moviesSvr.deleteMovie(movie_id)

        //Delete movie from redux
        dispatch({ type: "DELETE_MOVIE", payload: movie_id })

        /*
        Accessing the redux reducer of all subscriptions each movie has
        and deleting all the subscription of the deleted movie
        */
        dispatch({ type: "DELETE_MOVIE_SUBSCRIPTIONS", payload: movie_id })

        /**
         Accessing the redux reducer of all the subscriptions
         made by each user and delering the subscriptions of the deleted movie
         */
        dispatch({ type: "DELETE_DELETED_MOVIES_SUBS", payload: movie_id })
    }


    //Filter displayed movie accordin to search query typed in search bar
    const filterMovies = (searchQuery) => {

        //All movies in the system
        let all_movies = Array.from(moviesReducerData.movies.values())
        
        //Filtered movie according to search query
        let filtered_movies = all_movies.filter(movie =>
            movie["name"].toLowerCase().startsWith(searchQuery.toLowerCase()))
       
        if (filtered_movies == undefined)
            resetFunction([], 1)

        else
            resetFunction(filtered_movies, 1)
    }

    //If true loading spinner displays
    if (loading)
        return (
            <Grid container>
                <Grid item xs={12} lg={3}>
                    <CircularProgress />
                </Grid>
            </Grid>
        )
    else
        return (
            <div>

                <Grid container>

                    <Grid item xs={12} lg={3}>
                        {/*Search bar to filter movies
                           */}
                        {initialSearchQuery != undefined &&
                            <SearchBarComp filterMovies={filterMovies}
                                initialSearchQuery={initialSearchQuery}
                                movies={Array.from(moviesReducerData.movies.values())} />
                        }
                    </Grid>
                    <Grid item xs={12} lg={12}>

                        {
                            moviesInPage.map(
                                (movie, index) => {
                                    return (
                                        <MovieComp editMovie={props.editMovie}
                                            deleteMovie={deleteMovie}
                                            key={index}
                                            movieData={movie} />
                                    )
                                }
                            )
                        }
                    </Grid>

                    <Grid item xs={12} lg={5}>

                    </Grid>
                </Grid>

                {/*Pagination component */}
                {showPagination &&
                    <MoviesPaginationComp
                        handlePageChange={resetFunction}
                        pagesNum={pagesNum} />}
            </div>
        )
}