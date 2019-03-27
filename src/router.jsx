import React from 'react';
import { Route } from 'react-router-dom';
import AddStuff from './page/addStuff.jsx';
import About from './page/about.jsx';
import Index from './page/Index.jsx';

export let MyRouter = () => {
    return (
        <div>
            <Route exact path="/" component={Index}>
            </Route>
            <Route path="/addStuff" component={AddStuff}>
            </Route>
            <Route path="/about" component={About}>
            </Route>
        </div>
    );
};
