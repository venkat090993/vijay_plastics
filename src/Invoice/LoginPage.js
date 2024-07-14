import React,{Component} from 'react';
import firebase from 'firebase';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
class LoginPage extends Component{

    
    login=(e)=>{
        e.preventDefault();
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        firebase.auth().signInWithEmailAndPassword(email,password).then((u)=>{console.log("successfully logged in")})
        .catch(error=>{
            alert(error.toString())
        })
        
    }

    render(){
    return(

        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div>
         <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form Validate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e)=>{this.login(e)}}
          >
            Sign In
          </Button>
        </form>
      </div>
      </Container>

    )
}}
export default LoginPage;