import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import * as authActions from '../actions/auth';

//route imports
import SiteRoutes from '../SiteRoutes';

//css imports
import '../global.css';

//hoc imports
// import PrivateRoute from '../hocs/PrivateRoute';

class App extends Component {
    constructor(props) {
        super(props);
        this.props.fetchUser();
    }

    render() {
        return (
            <BrowserRouter>
                <SiteRoutes auth={this.props.auth} />
            </BrowserRouter>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, authActions)(App);
