import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';

//component imports
import Header from '../components/Header/Header';
import Dash from './Dash';
import FormAdmin from '../containers/FormAdmin/FormAdmin';
import NotFound from '../components/NotFound/NotFound';

const Landing = () => <h1>Landing Page</h1>;
const Discovery = () => <h1>Discovery Page</h1>;

class App extends Component {
    componentDidMount() {
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
