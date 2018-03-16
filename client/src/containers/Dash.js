import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../actions/form';

class Dash extends Component {
    componentDidMount() {
        console.log(this.props);
    }

    render() {
        return (
            <div>
                <button
                    onClick={() =>
                        this.props.createNewForm(
                            'hello world',
                            this.props.history
                        )
                    }
                >
                    Create New Form
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        redirect: state.formAdmin._id
    };
};

export default connect(mapStateToProps, actions)(withRouter(Dash));
