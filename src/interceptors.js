import axios from "axios"
import authSvr from './services/Auth_service'

//Interceptors for requests and responses of all server API calls
const interceptor = (store) => {
    axios.interceptors.request.use(req => {
        req.headers['x-access-token'] = authSvr.getToken()
        return req
    })

    axios.interceptors.response.use(
        response => {

            return response
        },
        async function (error) {
            
            if (error.response.status === 401 && 
                sessionStorage["token"]) {
                store.dispatch({ type: "LOGOUT" })
                authSvr.logout()
                
                return Promise.reject(error)
            }

            return Promise.reject(error)
        }
    )
}


export default { interceptor }