//Pagination component for displaying all the movies data in each page

import React from 'react'
import { Pagination } from '@mui/material'

//Style of pagination component
const styles = {
  root: {
    position: "fixed",
    bottom: 0,
    zIndex: 200,
    backgroundColor: "yellow",
    padding: "10px 80px",
    color: "white",
    width: "100%"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"

  }
}


const MoviesPaginationComp = ({handlePageChange,pagesNum}) => {
  

//Invoked when the page number is changed
const handleChange=(e,value)=>
{
  handlePageChange(undefined,value)
  window.scroll(0,0)
}
  return (
    <div style={styles.container}>
      <div style={styles.root}>
        <Pagination 
          onChange={handleChange}
          style={{
            display:"flex",
            justifyContent:"center"
          }}
          variant='outlined' count={pagesNum}/>
      </div>
    </div>
  )
}

export default MoviesPaginationComp


