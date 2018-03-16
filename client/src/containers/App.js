import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';

//css imports
import '../global.css';

//component imports
import Header from '../components/Header/Header';
import Dash from './Dash';
import FormAdmin from '../containers/FormAdmin/FormAdmin';
import NotFound from '../components/NotFound/NotFound';
import Login from '../components/Login/Login';

//hoc imports
// import PrivateRoute from '../hocs/PrivateRoute';

const Landing = () => <h1>Landing Page</h1>;
const Discovery = () => <h1>Discovery Page</h1>;

class App extends Component {
    constructor(props) {
        console.log('FETCH USER');
        super(props);
        this.props.fetchUser();
    }

    renderFormAdmin() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(3).shift();

        return <FormAdmin fid={fid} />;
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Header auth={this.props.auth} />
                    <Switch>
                        <Route path="/" exact component={Landing} />
                        <Route path="/discovery" exact component={Discovery} />
                        <Route path="/app/dashboard" exact component={Dash} />
                        <Route path="/app/login" exact component={Login} />
                        {/* <PrivateRoute
                            path="/app/dashboard"
                            component={Dash}
                            auth={this.props.auth}
                        /> */}
                        <Route
                            path="/app/edit/"
                            render={this.renderFormAdmin}
                        />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, authActions)(App);
