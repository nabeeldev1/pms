import React from 'react';
import classes from './Navbar.css';
import { Route, Link, Switch } from 'react-router-dom';
import Signin from '../Signin/Signin';
import Dashboard from '../Dashboard/Dashboard';
import Logout from '../Logout/Logout';
import Home from '../Home/Home';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import isLoggedIn from '../Auth/Auth'; 

const navbar = () => {
        let dashboard, logout, signin;

        if(isLoggedIn() === true) {
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
                    <PrivateRoute authed={isLoggedIn()} path="/dashboard" exact component={Dashboard} />
                    <Route path="/signin" exact component={Signin} />
                    <Route path="/logout" exact component={Logout} />
                </Switch>
            </div>
        );
}

export default navbar;