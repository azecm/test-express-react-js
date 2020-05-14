import React from 'react';
import {BrowserRouter, Route, Redirect, Link} from "react-router-dom";
import {Generator} from "./components/Generator";
import {Consumer} from "./components/Consumer";

function App() {
    return (
        <BrowserRouter>
            <ul>
                <li><Link to="/">Consumer</Link></li>
                <li><Link to="/generator">Generator</Link></li>
            </ul>
            <Route exact path="/" component={Consumer}/>
            <Route exact path="/generator" component={Generator}/>
            <Redirect to="/"/>
        </BrowserRouter>
    );
}

export default App;
