import React from 'react';

import { Switch, Route, NavLink } from 'react-router-dom';

import './FormRoutes.css';

/*
    Current Routes: (Form Owner and Collas (Edit))
    /app/dashboard
    /app/edit/fid/build
    /app/edit/fid/preview
    /app/edit/fid/responses
    /app/edit/fid/share

    For form collas with view:
    /app/dashboard
    /app/view/fid/build
    /app/view/fid/preview
    /app/view/fid/responses
    /app/view/fid/share
*/

//list of available routes
const OPS = ['build', 'preview', 'responses', 'share'];

const formRoutes = props => {
    const renderedNavi = OPS.map(operation => {
        return (
            <li key={operation}>
                <NavLink to={`${props.match.url}/${operation}`}>
                    {operation[0].toUpperCase() + operation.substring(1)}
                </NavLink>
            </li>
        );
    });

    const renderedRoutes = OPS.map(operation => {
        return (
            <Route
                key={operation}
                path={`${props.match.url}/${operation}`}
                exact
                render={() => <h1>Alo {operation}</h1>}
            />
        );
    });

    return (
        <React.Fragment>
            <ul className={'Bar'}>{renderedNavi}</ul>
            <Switch>{renderedRoutes}</Switch>
        </React.Fragment>
    );
};

export default formRoutes;
