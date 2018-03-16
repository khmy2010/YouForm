import React from 'react';

import NavItem from './NavItem';
import './Header.css';

const header = ({ auth }) => {
    let renderedContent = null;

    switch (auth) {
        case null:
            renderedContent = null;
            break;
        case false:
            renderedContent = (
                <NavItem link="/app/login" exact>
                    Login
                </NavItem>
            );
            break;
        default:
            renderedContent = (
                <React.Fragment>
                    <NavItem link="/app/dashboard" exact>
                        Dashboard
                    </NavItem>
                    <li>Welcome, {auth.name}</li>
                    <li>
                        <a href="/api/logout">Logout</a>
                    </li>
                </React.Fragment>
            );
            break;
    }

    return (
        <React.Fragment>
            <nav className="Header-Nav-Nav">
                <ul className="Header-Nav">
                    <NavItem link="/" exact>
                        Home
                    </NavItem>
                    <NavItem link="/discovery" exact>
                        Discovery
                    </NavItem>
                    {renderedContent}
                </ul>
            </nav>
        </React.Fragment>
    );
};

export default header;
