import React,{Component} from 'react';
import './App.css';
import Home from './home';
import Layout from './HOC/Layout'
import {BrowserRouter, Route} from 'react-router-dom'
import fire from './fire';
import LoginPage from './Invoice/LoginPage';  

class App extends Component {

  state = {user:null}

  componentDidMount(){
    this.authListner();
   
  }

  authListner(){
    fire.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({user})
      }
      else{
        this.setState({user:null})
      }
    })
  }

  render(){
    return (
      <BrowserRouter>
      <div className="App">
        <Layout>
        <Home />
        </Layout>
      </div></BrowserRouter>
    );
  }
  
}

export default App;
