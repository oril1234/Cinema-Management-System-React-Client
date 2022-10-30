import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import NavbarComp from "./Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authSvr from "../services/Auth_service";
import { MoviesTabListComp } from "./Movies/Movies";
import { UsersTabListComp } from "./Users/Users";
import { MembersTabListComp } from "./Members/Members";
import MenuTabListComp from "./MenuTabList";
import AuthWrapperComp from "./Auth/Auth_Wrapper";
import usersSvr from "../services/Users_service"
import moviessSvr from "../services/Movies_service"
import membersSvr from "../services/Members_service"
import subsSvr from "../services/Subscriptions_service"
import { CircularProgress, Grid } from '@mui/material';



/*
Main component of the app in which routing between differenet 
is executed based on the state of the user ( logged in or not)
*/
export default function MainPageComp(props) {

    //When true loading spinner is displayed
    const [loading, setLoading] = useState(true)

    //Deta of logged in user - exists if the user is logged in
    const authReducerData = useSelector(state => state.authReducer)
    
    //Navifation hook to navigate to login page if user is not logged in
    const navigate = useNavigate()

    //Hook to update redux with data fetched from server
    const dispatch = useDispatch()

    //When true logged in user component is displayed
    const [show, setShow] = useState(false)

    useEffect(() => {

        setLoading(true)

        //Function to update logged in user data from server in redux
        async function fetch_logged_in_user_data() {
            let resp = await authSvr.get_logged_in_user_data()
            dispatch({ type: "LOGIN", payload: resp.data.user })
            fetch_app_data()

        }

        /*
        Function to fetch all the system data from server, including
        the users, akk the movies, members and their subscriptions
        and adding this data to redex
        */
        async function fetch_app_data(id) {
            try {

                let [usersResp, moviesResp, membersResp, subsResp] = await
                    Promise.all([
                        usersSvr.getUsers(), moviessSvr.getMovies()
                        , membersSvr.getMembers(), subsSvr.getSubscriptions()]);

                setShow(true)
                
                dispatch({
                    type: "LOAD_USERS",
                    payload: { users_data: usersResp.data, logged_in_user_id: id }
                })
                setLoading(false)
                dispatch({ type: "LOAD_MOVIES", payload: moviesResp.data })
                dispatch({ type: "LOAD_MEMBERS", payload: membersResp.data })
                dispatch({ type: "LOAD_MOVIES_SUBS", payload: subsResp.data })
                
                dispatch({ type: "LOAD_MEMBERS_SUBS", payload: subsResp.data })
                
            } catch (err) {

            }
        }

        /*
        navigating to login page if JWT does not exists, meaning the
        user is not logged in
        */
        if (!sessionStorage["token"]) {
            authSvr.logout()
            navigate("/auth")
        }

        else {
            
            /*
            Executed if user is logged in, but has not fetched and updated
            his dara redux
            */
            if (Object.keys(authReducerData.loggedInUser).length == 0) {
                
                fetch_logged_in_user_data()
            }

            /*
            Executed if logged in user data is already updated
            but the other system data has to be ferched
            */
            else
                {
                    fetch_app_data(
                        authReducerData.loggedInUser.user_details.id)
                }
        }


    }, [authReducerData]


    )

    /*
    A component to create protected routes, in order to prevent the
    user from navigating to pages he's not allowed to be in

    */
    const Protected = ({ children }) => {
        if (!sessionStorage["token"])
            return <Navigate to="/auth" replace />
        return children
    }

        return (
            <div>
                <NavbarComp />
                <h1 style={{ marginTop: '12%' }}>Cinema Management</h1>
                {loading && sessionStorage["token"] &&
                <CircularProgress/>}
                <Routes>
                    <Route path="/auth" element={<AuthWrapperComp />} />


                    { show && <Route path="/menu" element={
                        <Protected>
                            < MenuTabListComp />
                        </Protected>
                    } >
                        {Object.keys(authReducerData.loggedInUser).length != 0 &&
                            authReducerData.loggedInUser["permissions"].
                                includes("Manage Users") &&
                            <Route path="users" element={<UsersTabListComp />} />}
                        {Object.keys(authReducerData.loggedInUser).length != 0 &&
                            authReducerData.loggedInUser["permissions"].
                                includes("View Members") &&
                            <Route path="subscriptions" element={<MembersTabListComp />} />}
                        {Object.keys(authReducerData.loggedInUser).length != 0 &&
                            authReducerData.loggedInUser["permissions"].
                                includes("View Movies") &&
                            <Route path="movies" element={<MoviesTabListComp />} />}
                    </Route>}
                    {show && <Route path="/" element={<Navigate to="/menu" replace />} />}





                </Routes>
            </div>
        )
}