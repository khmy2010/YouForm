import React from 'react';
import { NavLink } from 'react-router-dom';

const navItem = props => (
    <li>
        <NavLink
            to={props.link}
            exact={props.exact}
            activeClassName="Header-Active"
        >
            {props.children}
        </NavLink>
    </li>
);

export default navItem;
