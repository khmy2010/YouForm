//this file contains all the route available for the site visitor
import React from 'react';
import { Switch, Route } from 'react-router-dom';

//component imports
import Dash from './containers/Dash/Dash';
import FormAdmin from './containers/FormAdmin/FormAdmin';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import Landing from './components/Landing/Landing';
import Test from './components/Test';
import Form from './containers/Form/Form';

const Discovery = () => <h1>Discovery Page</h1>;

//should take login out from /app route, since it is not protected route
const siteRoutes = props => {
    const renderLanding = () => <Landing auth={props.auth} />;

    return (
        <Switch>
            <Route path="/" exact component={renderLanding} />
            <Route path="/discovery" exact component={Discovery} />
            <Route path="/form/:fid" exact component={Form} />
            <Route path="/app/dashboard" exact component={Dash} />
            <Route path="/app/login" exact component={Login} />
            <Route path="/app/test" exact component={Test} />
            <Route path="/app/admin/:fid" component={FormAdmin} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default siteRoutes;
