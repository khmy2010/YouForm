import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import * as actions from '../../actions/form';
import './Form.css';

class Form extends Component {
    state = {
        currentState: 0
    };

    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(2).shift();
        this.props.fetchForm(fid);
    }

    renderContent() {
        if (this.props.error) {
            return (
                <Splash
                    error={this.props.errorMsg}
                    history={this.props.history}
                />
            );
        }

        return <div className="Form">Alo Form</div>;
    }

    render() {
        return this.renderContent();
    }
}

const mapStateToProps = state => {
    return {
        error: state.form.error,
        errorMsg: state.form.errorMsg
    };
};

export default connect(mapStateToProps, actions)(Form);
