import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import FormRoutes from './FormRoutes';

class FormAdmin extends Component {
    render() {
        return (
            <div>
                <FormRoutes match={this.props.match} />
                <h3>FID: {this.props.fid}</h3>
            </div>
        );
    }
}

export default withRouter(FormAdmin);
