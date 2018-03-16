import React from 'react';

import './Login.css';

const login = props => {
    const redirectState = props.location.state;
    let redirectText = null;

    if (redirectState && redirectState.referrer) {
        redirectText = 'Sign in to continue to YouForm.';
    }

    return (
        <div className="Global-Content">
            <h3 style={{ marginBottom: '25px' }}>Login with Google</h3>
            <p className="Login-Redirect">{redirectText}</p>
            <button
                className="Login-LoginWithGoogle"
                onClick={() => (window.location.href = '/auth/google')}
            >
                Login with Google
            </button>
        </div>
    );
};

export default login;
