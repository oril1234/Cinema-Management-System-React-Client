
/*
This reducer maintains the subscriptions of each member arranged in
a map structure in which each entry contains the member id as the key
and an array of subscriptions of this members as the value
*/
export const membersSubsReducer = (state = {
    subs: new Map()
},
    action) => {
    switch (action.type) {

        //Handled when data from server is loaded
        case "LOAD_MEMBERS_SUBS":
            {
                let state_copy={...state}
                let all_subs= action.payload

                
                for(let i=0;i<all_subs.length;i++)
                {
                    let member_subs=all_subs[i]["subscriptions"]
                    let member_id=all_subs[i]["memberID"]
                    let formated_member_subs=[]
                    
                    for (let j = 0; j < member_subs.length; j++) 
                    {
                        let sub_data={...member_subs[j]}
                        sub_data["memberID"]=member_id
    
                        formated_member_subs.push(sub_data)
    
                    }
                    state_copy.subs.set(member_id,formated_member_subs)
                }

                return state_copy
            }

        //Handled when a new subscription to a movie is done
        case "ADD_MEMBER_SUB":
            {
                let state_copy={...state}
                let new_sub = action.payload
                let key = new_sub["memberID"]
                let updated_member_subs = []
                if (state_copy.subs.has(key))
                    //Adding current data to updated subscriptions array
                    updated_member_subs.push(state_copy.subs.get(key))

                //Adding new subscription data to member subscriptions
                updated_member_subs.push(new_sub)
                state_copy.subs.set(key, updated_member_subs)

                return state_copy
            }

        //Handled when member is deleted and tus all of his subscriptions
        case "DELETE_MEMBER_SUBSCRIPTIONS":
            {
                let state_copy = { ...state }
                let member_id_to_delete = action.payload
                state_copy.subs.delete(member_id_to_delete)
                return state_copy
            }

        //Deleting all subscriptiona of a deleted movie 
        case "DELETE_DELETED_MOVIES_SUBS":
            {

                let state_copy = { ...state }

                /*
                The id of the deleted movie of which its subscrptions
                will be deleted
                */
                let movie_id=action.payload
                let values=Array.from(state_copy.subs.values())
                for(let i=0;i<values.length;i++)
                {
                    /*
                    Id of the member to which the current subscriptions
                    (values[i]) belong to
                    */
                    let member_id=values[i][0]["memberID"]

                    /*
                    All the subscriptions which are to all movies
                    other than the deleted one
                    */
                    let filtered=values[i].filter(sub=>
                        sub["movieID"]!==movie_id)
                    
                    /*
                    Update the map after deleting subscriptions
                    */    
                    if(filtered.length>0)
                        state_copy.subs.set(member_id,filtered)
                    
                    //Delete member ID key if member has no subscriptions
                    else
                        state_copy.subs.delete(member_id)
                }
                return state_copy

            }
        default:
            return state
    }
}

