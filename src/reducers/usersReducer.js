
/*
This reducer maintains the users data in
a map structure in which each entry contains the user id as the key
and an its data as the value
*/
export const usersReducer = (state = { users: new Map(), edit_user_state: true },
    action) => {
    switch (action.type) {
        case "LOAD_USERS":
            {

                let users_data = [...action.payload.users_data]

                /*Excluding the user that is currently logged in to
                 the system in order to prevent a situation in which he
                 accidently edits or deleted his own details
                 */
                users_data=users_data.filter(user=>
                    user.user_details.id!=action.payload.logged_in_user_id)
                let state_copy = { users: new Map() }
                for (let i = 0; i < users_data.length; i++) {
                    state_copy.users.set(users_data[i]["user_details"]["id"],
                     users_data[i])
                }

                return state_copy
            }

        //Handled when new user is added, or existing one is updated
        case "ADD_USER":
        case "UPDATE_USER":
            {
                let state_copy = { ...state }
                let user_data = action.payload
                state_copy.users.set(user_data["user_details"]["id"],
                    user_data)
                return state_copy
            }

        //Delete user by his id
        case "DELETE_USER":
            {
                let state_copy = { ...state }
                state_copy.users.delete(action.payload)
                return state_copy
            }
        default:
            return state

    }
}

