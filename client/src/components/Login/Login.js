import React from 'react';

import './Login.css';
import googleSVG from '../../assets/images/google.svg';
import xSVG from '../../assets/images/x.svg';

const login = ({ history }) => {
    document.title = 'Login to continue';

    return (
        <div className="Login">
            <h1>Welcome Home!</h1>
            <p>Login to feel like home, again</p>
            <div
                className="Login__Button"
                onClick={() => (window.location.href = '/auth/google')}
            >
                <img src={googleSVG} alt="google" />
                <span>Login with Google</span>
            </div>
            <hr />
            <div className="Login__Button" onClick={() => history.replace('/')}>
                <img src={xSVG} alt="no want" />
                <span>I don't want to login</span>
            </div>
        </div>
    );
};

export default login;
