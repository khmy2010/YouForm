import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Header from '../components/Header/Header';
import Dash from './Dash';
import FormAdmin from '../containers/FormAdmin/FormAdmin';
import { setTabTitle } from '../utils';

const Landing = () => <h1>Landing Page</h1>;
const Discovery = () => <h1>Discovery Page</h1>;

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
        setTabTitle('Home');
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
                    <Route path="/" exact component={Landing} />
                    <Route path="/discovery" exact component={Discovery} />
                    <Route path="/app/dashboard" exact component={Dash} />
                    <Route path="/app/edit/" render={this.renderFormAdmin} />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, authActions)(App);
