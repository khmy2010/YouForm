import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const privateRoute = ({ component: WrappedComponent, auth, ...props }) => {
    let authRedirect = (
        <Route path="/app/dashboard" {...props} component={WrappedComponent} />
    );

    //if visitor is unauthenticated, route them back to login page
    if (!auth) {
        authRedirect = (
            <Redirect
                to={{ pathname: '/app/login', state: { referrer: 'redirect' } }}
            />
        );
    }

    return authRedirect;
};

export default privateRoute;
