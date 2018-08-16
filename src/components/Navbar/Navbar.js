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
            logout = <Link to="/logout">Logout</Link>;
            dashboard = <Link to="/dashboard">Dashboard</Link>;
            signin = '';
        }
        else {
            logout = ''; 
            dashboard = '';
            signin = <Link to="/signin">Sign in</Link>;
        }

        return (
            <div className={classes.Nav}>
                <div className={classes.NavHeader}>
                    <div className={classes.NavTitle}>
                        PMS
                    </div>
                </div>
                <div className={classes.NavLinks}>
                    <Link to="/">Home</Link>
                    {dashboard}
                    {signin}
                    {logout}
                </div>
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