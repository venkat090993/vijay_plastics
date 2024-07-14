import React, {Component} from 'react';
import axios from 'axios';
import Navbar from '../Navbar'
import Grid from '@material-ui/core/Grid';
import fire from '../../fire'


class ListingPage extends Component{
    
    state={itemList : [],item:[]}

    componentDidMount(){

        axios.get('https://invoicebuilder-28adf.firebaseio.com/invoices.json').then(res=>{
            const data = res.data;
            const itemList = [];
            
            for(let key in data){
                
                itemList.push({...data[key], key:key}) 
                                       
            }
            this.setState({itemList:itemList});
     })
        }

    logOut=()=>{
        fire.auth().signOut().then((u)=>console.log('successfully signed out')).catch(error=>console.log(error))}

    render(){

        const style={float:"left", margin:"10px"}
        
        if(this.state.itemList){
        return( <Grid container>
            <Grid item md={12} >
            <Navbar logOut={this.logOut} />
           </Grid>
<Grid item>
        </Grid>
        
        {this.state.itemList.map((item, index)=>{
           const d = item.invoiceData.map(i=>{
                return(
            <div>{i.id} : {i.value  }</div>
                )
            })
            return(
                <Grid>
        <div style={{width:"600px", height:"100px", margin:"10px"}}> <div style={style}>Invoice Number:{item.invoiceNo}</div>  <div style={style}>Total:{item.total}</div> <div style={style}>{d}</div> </div>
            </Grid>
            
            )
        })}</Grid>)
    }}
}

export default ListingPage;