import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../actions/form';
import { setTabTitle } from '../utils';

class Dash extends Component {
    componentDidMount() {
        setTabTitle('Dashboard');
    }

    redirect() {
        if (this.props.redirect) {
            return <Redirect push to={`edit/${this.props.redirect}`} />;
        } else {
            return null;
        }
    }
    render() {
        return (
            <div>
                {this.redirect()}
                <button onClick={() => this.props.createNewForm('hello world')}>
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

export default connect(mapStateToProps, actions)(Dash);
