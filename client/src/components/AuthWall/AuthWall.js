import React from 'react';

import Login from '../Login/Login';
import './AuthWall.css';

/*
    The purpose of authwall is to communicate 
    with our application 
    to redirect user after they login.

    Still haven't figure out the architecture yet,
    not in priority.

    Now it still not robust.
    What if the user is authenticated but don't have access?

    Still have to think out the architecture properly.
*/
const authWall = props => {
    return (
        <div className="AuthWall">
            <h1>Knock Knock!</h1>
            <p className="AuthWall__Help">
                Login to continue with your previous operation.
            </p>
            <Login />
        </div>
    );
};

export default authWall;
