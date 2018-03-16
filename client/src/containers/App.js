import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import * as authActions from '../actions/auth';

//route imports
import SiteRoutes from '../SiteRoutes';

//component imports
import Header from '../components/Header/Header';

//css imports
import '../global.css';

//hoc imports
// import PrivateRoute from '../hocs/PrivateRoute';

class App extends Component {
    constructor(props) {
        console.log('FETCH USER');
        super(props);
        this.props.fetchUser();
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    <Header auth={this.props.auth} />
                    <SiteRoutes auth={this.props.auth} />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, authActions)(App);
