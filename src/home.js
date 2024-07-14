import React, {useEffect} from 'react';
import Invoice from './Invoice/Invoice';
import DeliveryChellan from './Delivery_chellan/Invoice';
import ListingPage from './Invoice/ListingPage/ListingPage';
import {Route, Switch} from 'react-router-dom';

const Home =()=>{

     return(
        <div>
            <Switch>
            <Route path="/listingpage" exact component={ListingPage} />
        <Route path='/' exact component={Invoice} />
        <Route path='/DC' exact component={DeliveryChellan} />
            </Switch>
            

        </div>
    )
}

export default Home