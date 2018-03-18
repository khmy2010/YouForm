//this file contains all the route available for the site visitor
import React from 'react';
import { Switch, Route } from 'react-router-dom';

//component imports
import Dash from './containers/Dash';
import FormAdmin from './containers/FormAdmin/FormAdmin';
import NotFound from './components/NotFound/NotFound';
import Login from './components/Login/Login';
import Test from './components/Test';

const Landing = props => {
    console.log(props);
    return <h1>Landing Page</h1>;
};
const Discovery = () => <h1>Discovery Page</h1>;

const siteRoutes = () => {
    return (
        <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/discovery" exact component={Discovery} />
            <Route path="/app/dashboard" exact component={Dash} />
            <Route path="/app/login" exact component={Login} />
            <Route path="/app/test" exact component={Test} />
            <Route path="/app/edit/:fid" component={FormAdmin} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default siteRoutes;
