
import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import AllMoviesComp from './AllMovies'
import EditMovieComp from './EditMovie'
import AddMovieComp from './AddMovie'
import { useSelector } from 'react-redux'

/*
Component to switch between 3 pages of movies:
1. All movies and their details
2. Edit a specific movie details
3. Adding new movie
*/
export const MoviesTabListComp = () => {

    //Logged in user from redux
    const authRedData = useSelector(state => state.authReducer)


    //The current value denotes the tab that is being displayed
    const [value, setValue] = useState("All Movies")


    //Invoked when the current tab is changed
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    /*
    Function to move to edit movie page existing from it according to the
    argument. 3 denotes Edit state 
    */
    const changeEditMovieState = (state) => {
        if (state)
            setValue("Edit Movie")
        else
            setValue("All Movies")
    }


    return (
        <Box>
            <h2>Movies</h2>

            <TabContext value={value} >
                {/*If tab value is not 3 (Edit mode) tabs will be displayed */}
                {value != "Edit Movie" && <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                    <TabList aria-label='Tabs examle'
                        onChange={handleChange}>

                        <Tab label="All Movies" value="All Movies" />
                        {authRedData.loggedInUser["permissions"].
                            includes("Create Movies") &&
                        <Tab label="Add Movie" value="Add Movie" />}


                    </TabList>
                </Box>}

                <TabPanel children={<AllMoviesComp
                    editMovie={changeEditMovieState} />}
                    value="All Movies">

                </TabPanel>

                <TabPanel children={<AddMovieComp
                    addMovie={changeEditMovieState} />}
                    value="Add Movie">

                </TabPanel>

                <TabPanel 
                    value="Edit Movie"
                    children={<EditMovieComp
                    toggleEdit={changeEditMovieState} />}
                    >
                </TabPanel>
            </TabContext>

        </Box>
    )
}
