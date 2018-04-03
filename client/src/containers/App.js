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

    renderContent() {
        switch (this.props.auth) {
            case null:
                //pending for authentication, show loading screen
                return null;
            case false:
            //purposely fallthrough
            //need to brain the AuthWall thingy
            // eslint-disable-next-line
            default:
                return (
                    <BrowserRouter>
                        <SiteRoutes auth={this.props.auth} />
                    </BrowserRouter>
                );
        }
    }

    render() {
        return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, authActions)(App);
