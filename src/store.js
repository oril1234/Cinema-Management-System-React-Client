import { createStore, combineReducers} from 'redux'
import { authReducer } from './reducers/authReducer'
import { membersReducer } from './reducers/membersReducer'
import { moviesReducer } from './reducers/moviesReducer'
import { usersReducer } from './reducers/usersReducer'
import { moviesSubsReducer } from './reducers/moviesSubsReducer'
import { membersSubsReducer } from './reducers/membersSubsReducer'
import {composeWithDevTools} from 'redux-devtools-extension'

const rootReducer = combineReducers({
  authReducer: authReducer,
  usersReducer: usersReducer,
  moviesReducer:moviesReducer,
  membersReducer:membersReducer,
  moviesSubsReducer:moviesSubsReducer,
  membersSubsReducer:membersSubsReducer


 
})

const initialState = {}


const store = createStore(
  rootReducer,
  composeWithDevTools()
)

export default store
