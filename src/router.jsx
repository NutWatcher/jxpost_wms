import React from 'react';
import { Route } from 'react-router-dom';
import AddStuff from './page/addStuff.jsx';
import SaveStuff from './page/saveStuff.jsx';
import Index from './page/Index.jsx';

export let MyRouter = () => {
    return (
        <div>
            <Route exact path="/" component={Index}>
            </Route>
            <Route path="/addStuff" component={AddStuff}>
            </Route>
            <Route path="/saveStuff" component={SaveStuff}>
            </Route>
        </div>
    );
};
