import React from 'react';

import { Switch, Route } from 'react-router-dom';

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

    return <Switch>{renderedRoutes}</Switch>;
};

export default formRoutes;
