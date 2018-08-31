import React from 'react';
import classes from './Snackbar.css';

const Snackbar = (props) => {
    return (
        <div className={props.snackbarShow === true ? classes.snackbar : ''}>
            {props.message}
        </div>    
    );
};

export default Snackbar;

