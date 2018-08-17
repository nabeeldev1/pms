import React from 'react';
import  { Redirect } from 'react-router-dom';
import { isLogout } from '../../Utils/Auth/Auth';

const logout = () => {
    const  loggedOut = isLogout();
    if(loggedOut) {
        return (
            <Redirect to='/signin'  />
        );
    }
};

export default logout;