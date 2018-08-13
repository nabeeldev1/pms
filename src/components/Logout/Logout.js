import React from 'react';
import  { Redirect } from 'react-router-dom';

const logout = () => {
    localStorage.removeItem('userObj');

    return (
        <Redirect to='/signin'  />
    );
};

export default logout;