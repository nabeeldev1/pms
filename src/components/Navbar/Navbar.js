import React, { Component } from 'react';
import classes from './Navbar.css';
import { Route, Link, Switch } from 'react-router-dom';
import Signin from '../Signin/Signin';
import Layout from '../Layout/Layout';
import Logout from '../Logout/Logout';
import Home from '../Home/Home';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

class Navbar extends Component {
    render () {
        let loggedIn, dashboard, logout, signin;
        loggedIn = JSON.parse(localStorage.getItem('userObj')) ? true : false;

        if(loggedIn === true) {
            logout = <li><Link to="/logout">Logout</Link></li>;
            dashboard = <li><Link to="/dashboard">Dashboard</Link></li>;
            signin = '';
        }
        else {
            logout = ''; 
            dashboard = '';
            signin = <li><Link to="/signin">Sign in</Link></li>;
        }

        return (
            <div className={classes.Nav}>
                <header>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            {dashboard}
                            {signin}
                            {logout}
                        </ul>    
                    </nav>    
                </header>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <PrivateRoute authed={loggedIn} path="/dashboard" exact component={Layout} />
                    <Route path="/signin" exact component={Signin} />
                    <Route path="/logout" exact component={Logout} />
                </Switch>
            </div>
        );
    }
}

export default Navbar;