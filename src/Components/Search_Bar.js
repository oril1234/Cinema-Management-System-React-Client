import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";


/*
 Search bar component in which there is an input field in which
 the text the user types filters the movies been displayed to the user

 */
export default function SearchBarComp(props) {

    //Search query that is typed in the search bar
    const [searchQuery, setSearchQuery] = useState("");

    /*
    When true the auto complete list of the filtered movies,
    based on the user input in the search bar is displayed
    */
    const [showFilteredData, setShowFilteredData] = useState(false)
    useEffect(()=>
    {
        setSearchQuery(props.initialSearchQuery)

        //Document click event to check if autocomple list was clicked
        document.addEventListener("click",handleClickOutside,true)
    },[])

    //Reference of the text field of search bar
    const inputRef=useRef(null)

    //Reference of the autocomplete list
    const fliteredDataRef=useRef(null)

    /*
    Invoked whenver a click is done in order to check if neither
    the text field, nor the autocomplete list where clicked, and if so
    the autocomplete list disappears
    */
    const handleClickOutside=(e)=>
    {
        if(inputRef.current!=undefined && 
            !inputRef.current.contains(e.target) &&
        !fliteredDataRef.current.contains(e.target))
            setShowFilteredData(false)
    }

    /*
    Functiom triggered whenever the user inputs text in the text field
    in orderto show only the movies that starts with the text input
    */
    const filterData = () => {
       
        if (!searchQuery) {
            return props.movies
        } else {
            return props.movies.filter((movie) =>
                movie["name"].toLowerCase().startsWith(searchQuery.toLocaleLowerCase()));
        }
    };
    return (
        <div
            style={{
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: 20
            }}
        >

            <TextField
                ref={inputRef}
                inputProps={{type:"search"}}
                id="search-bar"
                className="text"
                onFocus={(e)=>
                {
                    if (e.target.value != undefined && e.target.value != "")
                    setShowFilteredData(true)                    
                }}
                onChange={(e) => 
                {
                    {
                        let val=e.target.value
                        setSearchQuery(val)
                        if (val != undefined && val != "")
                        {
                            setShowFilteredData(true)
                        }
                        else
                            setShowFilteredData(false)
                        
                        props.filterMovies(val)
                        
                    }
                }}

                label="Enter a movie name"
                variant="outlined"
                placeholder="Search..."
                size="small"
                autoComplete="off"
                value={searchQuery}
                
            />


            <div style={{ padding: 3 }} ref={fliteredDataRef}>
                {showFilteredData &&
                    filterData().map((movie) => (
                        <div
                            className="text"
                            
                            onClick={() => {
                                setSearchQuery(movie["name"]);
                                props.filterMovies(movie["name"])
                                setShowFilteredData(false)
                            }}
                            style={{
                                padding: 5,
                                justifyContent: "normal",
                                fontSize: 20,
                                color: "blue",
                                margin: 1,
                                width: "250px",
                                BorderColor: "green",
                                borderWidth: "10px",
                                cursor:"pointer"
                            }}
                            key={movie["_id"]}
                        >
                            {movie["name"]}
                        </div>
                    ))}
            </div>
        </div>
    )

}