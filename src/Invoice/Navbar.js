import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {NavLink, Route} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './Navbar.css'



const Navbar =(props)=>{
    return(
          <div className="flex-container">
          <div>
          <Typography variant="h6" color="inherit">
            <NavLink style={{color:'white', textDecoration:"none"}} to='/' >Vijay Plastics</NavLink>
          </Typography>
          </div>
          <div class='buttonDiv'>
          <Button variant="contained" outlined color="secondary"  onClick={props.saveData}>Save PDF</Button>
          <Button variant="contained" outlined color="secondary" onClick={props.generate}>Generate PDF</Button>
          <Button variant="contained" outlined color="secondary"><NavLink style={{color:'white', textDecoration:"none"}} to='/listingpage'>Invoice deck</NavLink></Button>
          <Button variant="contained" outlined color="secondary" onClick={props.logOut}>Logout</Button>
          </div>
          </div>
              )
}

export default Navbar;