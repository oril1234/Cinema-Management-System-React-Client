
/*
Reducer to handle the data of all the members ( who can subscribe to
    movies) in every member id is a key to the corresponding member

*/
export const membersReducer = (state = { members :new Map(),edit_member_state:true},
     action) =>
{
    switch(action.type)
    {
        //Handled when data from server is sent to be stored
        case "LOAD_MEMBERS":
            {
                let members_data = action.payload
                let state_copy = { members:new Map() }
                for (let i = 0; i < members_data.length; i++)
                    state_copy.members.set(members_data[i]["_id"], members_data[i])

                return state_copy
            }

        //Handled when new member is added or existing one is updated
        case "ADD_MEMBER":
        case "UPDATE_MEMBER":
            { 
                let state_copy = { ...state }
                let member_data=action.payload
                state_copy.members.set(member_data["_id"],member_data)
                return state_copy
            }


        //Handled when a member is deleted by his id
        case "DELETE_MEMBER":
            {
                let state_copy = { ...state }
                state_copy.members.delete(action.payload) 
                return state_copy
            }
        default:
            return state
    }
}

