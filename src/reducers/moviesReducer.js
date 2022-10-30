
/*
Reducer to maintain all the movies data arranged in map structure
in which each entry has the movie id as the key and the movie data
as the value
*/
export const moviesReducer = (state = {
    movies: new Map()
},
    action) => {
    switch (action.type) {

        //Handled when new data from server arrived
        case "LOAD_MOVIES":
            {
                let movies_data = action.payload
                let state_copy = { ...state }
                for (let i = 0; i < movies_data.length; i++)
                    state_copy.movies.set(movies_data[i]["_id"], movies_data[i])

                return state_copy
            }

        //Handled when new movie is added, or existing one is updated
        case "ADD_MOVIE":
        case "UPDATE_MOVIE":
            { 
                let state_copy = { ...state }
                let movie_data=action.payload
                state_copy.movies.set(movie_data["_id"],movie_data)
                return state_copy
            }

        //Handled when movie is deleted by its id
        case "DELETE_MOVIE":
            {
                let state_copy = { ...state }
                state_copy.movies.delete(action.payload) 
                return state_copy
            }
        default:
            return state
    }
}

