import { Chip, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import membersSvr from "../../services/Members_service"
import MemberComp from "./Member"

//Component for displaying all the members in the system
export default function AllMembersComp(props) {

    //All the members in the system
    const [members, setMembers] = useState([])

    //Hook to load members reducer with members data after fetched from server
    const dispatch = useDispatch()

    //Hook to fetch members data from redux if the reducer is not 
    //empty
    const membersReducerData = useSelector(state => state.membersReducer)

    //Hook to fetch data of subscriptions of members from redux if
    // the reducer is not empty
    const subscriptionsReducerData =
        useSelector(state => state.subscriptionsReducer)

       
    /*
    When true only a single memeber is displayed, done by filtering
    all the members by their names
    */
    const [showFilter,setShowFilter]=useState(false)

    useEffect(() => {

        //All the members data from redux reducer
        let values = Array.from(membersReducerData.members.values())

        /*
        A specific member id that if exists the page displays only
        the correspondin member
        */
        let specific_member_id = sessionStorage["specific_member_id"]
        sessionStorage.removeItem("specific_member_id")

        if (specific_member_id) {

            //Filtering the members according to the member id
            let filtered_members = values.filter(
                member => member["_id"] == specific_member_id)
            if (filtered_members != undefined) {

                setMembers(filtered_members)
                
                /*
                Displaying the chip Material Ui component with the name
                of the member by which the filter was done
                */ 
                setShowFilter(true)
            }
        }
        else {
            setMembers(values)
        }
    }, [membersReducerData])

    /*
    Triggered after the Material UI chip component was closed
    meaning there's no filter, and all the members are displayed
    */
    const reloadMembers = () => {
        
        setMembers(Array.from(membersReducerData.members.values()))
        setShowFilter(false)
    }
    
    //Function to delete member from server and redux
    const deleteMember = async (member_id) => {
        await membersSvr.deleteMember(member_id)

        /*
        Delete member from the refux reducer in which its state contains
        a map wherein each key is a member id, and the value is the 
        member data
        */
        dispatch({ type: "DELETE_MEMBER", payload: member_id })

        /*
        Deleting the all member subscriptions from the redux reducer 
        in which its state contains a map wherein each key is a 
        member ID and the value is all the subscriptions of this member
        */
        dispatch({ type: "DELETE_MEMBER_SUBSCRIPTIONS", payload: member_id })

        /*
        Deleting the all member subscriptions also from the redux reducer 
        in which its state contains a map wherein each key is a 
        movie ID and the value is all the subscriptions fpr this movie
        */
        dispatch({ type: "DELETE_DELETED_MEMBERS_SUBS", payload: member_id })
    }

    return (
        <div>
            {showFilter &&
                <Grid>
                    <Grid style={{ textAlign: "left" }}>
                        <label ><strong>Filtered By:</strong></label>
                    </Grid>
                    <Grid>
                        <Stack direction="row">
                            <Chip onDelete={() => reloadMembers()} label={members[0]["name"]}></Chip>

                        </Stack>
                    </Grid>
                </Grid>}
            {
                members.map(
                    (member, index) => {
                        return (
                            <MemberComp editMember={props.editMember}
                                deleteMember={deleteMember}
                                key={index}
                                memberData={member} />
                        )
                    }
                )
            }

        </div>
    )
}