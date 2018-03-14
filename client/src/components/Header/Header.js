import React from 'react';

import NavItem from './NavItem';

const header = ({ auth }) => {
    let renderedContent = null;

    switch (auth) {
        case false:
            renderedContent = (
                <li>
                    <a href="/auth/google">Login with Google</a>
                </li>
            );
            break;
        default:
            renderedContent = (
                <NavItem link="/app/dashboard" exact>
                    Go to Dashboard
                </NavItem>
            );
            break;
    }

    return (
        <div>
            <NavItem link="/" exact>
                Home
            </NavItem>
            {renderedContent}
        </div>
    );
};

export default header;
