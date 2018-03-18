import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from '../actions/form';

class Dash extends Component {
    state = {
        name: ''
    };

    handleChange = event => {
        this.setState({
            name: event.target.value
        });
    };

    render() {
        return (
            <div>
                <input
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={e => this.handleChange(e)}
                    style={{
                        width: '80%',
                        display: 'block',
                        marginBottom: '10px'
                    }}
                />
                <button
                    onClick={() =>
                        this.props.createNewForm(
                            { name: this.state.name, updated: Date.now() },
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
