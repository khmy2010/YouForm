import React from 'react';

import './Login.css';

const login = props => {
    document.title = 'Login to continue';
    return (
        <div className="Global-Content">
            <h3 style={{ marginBottom: '25px' }}>Login with Google</h3>

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
