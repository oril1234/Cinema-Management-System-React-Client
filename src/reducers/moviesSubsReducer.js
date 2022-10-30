
/*
This reducer maintains the subscriptions of each movie arranged in
a map structure in which each entry contains the movie id as the key
and an array of subscriptions of this movie as the value
*/
export const moviesSubsReducer = (state = {
    subs: new Map()
},
    action) => {
    switch (action.type) {

        //Handled when new data of subscriptions from server arrives
        case "LOAD_MOVIES_SUBS":
            {
                
                if (state.subs.size > 0)
                    return { ...state }
                let state_copy = { ...state }

                let all_subs = action.payload


                for (let i = 0; i < all_subs.length; i++) {
                    
                    let member_subs = all_subs[i]["subscriptions"]
                    let member_id = all_subs[i]["memberID"]
                    console.log(all_subs.length)
                    for (let j = 0; j < member_subs.length; j++) {
                        
                        let sub_data = { ...member_subs[j] }
                        sub_data["memberID"] = member_id
                        let key =
                            member_subs[j]["movieID"]
                        let movie_subs = []
                        if (state_copy.subs.has(key))
                            //Adding current data to new subscriptions array
                            movie_subs.push(...state_copy.subs.get(key))

                        //Adding new subscriptions data to new subscriptions array
                        movie_subs.push(sub_data)
                        state_copy.subs.set(key, movie_subs)
                        
                    }
                }
                
                return state_copy
            }

        //Handled when a new subscription to a move is done
        case "ADD_MOVIE_SUB":
            {

                let state_copy = { ...state }

                let new_sub = action.payload
                let key = new_sub["movieID"]
                let updated_movie_subs = []
                if (state_copy.subs.has(key))
                    //Adding current data to updated subscriptions array
                    updated_movie_subs.push(state_copy.subs.get(key))

                //Adding new subscription data to movie subscriptions
                updated_movie_subs.push(new_sub)
                state_copy.subs.set(key, updated_movie_subs)
                return state_copy
            }

        //Delete all the subscriptions of a speicific movie
        case "DELETE_MOVIE_SUBSCRIPTIONS":
            {
                let state_copy = { ...state }
                let member_id_to_delete = action.payload
                state_copy.subs.delete(member_id_to_delete)
                return state_copy
            }

            
        //Deleting all subscriptiona of a deleted member
        case "DELETE_DELETED_MEMBERS_SUBS":
            {

                let state_copy = { ...state }

                /*
                The id of the deleted member of which its subscrptions
                will be deleted
                */
                let member_id = action.payload
                let values = Array.from(state_copy.subs.values())
                for (let i = 0; i < values.length; i++) {
                    /*
                    Id of the movie to which the current subscriptions
                    (values[i]) belong to
                    */
                    let movie_id = values[i][0]["movieID"]

                    /*
                    All the subscriptions made by all the members
                    other than the deleted one
                    */
                    let filtered = values[i].filter(sub =>
                        sub["memberID"] !== member_id)

                    /*
                    Update the map after deleting subscriptions
                    */
                    if (filtered.length > 0)
                        state_copy.subs.set(movie_id, filtered)

                    //Delete movie ID key if movie has no subscriptions
                    else
                        state_copy.subs.delete(movie_id)
                }

                return state_copy

            }
        default:

            return state
    }
}

