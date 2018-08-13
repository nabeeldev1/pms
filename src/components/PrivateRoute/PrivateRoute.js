import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => authed === false
          ? <Redirect to={{pathname: '/signin'}}  />
          : <Component {...props} />}
      />
    )
  }

  export default PrivateRoute;