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
                    <li>
                        <a href="/api/logout">Logout</a>
                    </li>
                </React.Fragment>
            );
            break;
    }

    // return (
    //     <React.Fragment>
    //         <nav className="Header-Nav-Nav">
    //             <ul className="Header-Nav">
    //                 <NavItem link="/" exact>
    //                     Home
    //                 </NavItem>
    //                 <NavItem link="/discovery" exact>
    //                     Discovery
    //                 </NavItem>
    //                 {renderedContent}
    //             </ul>
    //         </nav>
    //     </React.Fragment>
    // );
    return (
        <div className="Header__Wrapper">
            <div className="Header__YouForm">
                <NavItem link="/" exact>
                    YouForm
                </NavItem>
            </div>
            <ul className="Header__Navigation">
                <NavItem link="/discovery" exact>
                    Discovery
                </NavItem>
                {renderedContent}
            </ul>
        </div>
    );
};

export default header;
