import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import Preloading from '../../components/Preloading/Preloading';
import Controls from './Controls/Controls';
import Change from './Controls/Change/Change';

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

    renderWelcome() {
        return (
            <div className="Form__Welcome">
                <h1>{this.props.form.name}</h1>
            </div>
        );
    }

    handleBack() {
        console.log('back');
    }

    handleNext() {
        console.log('next');
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

        if (this.props.loading) {
            return <Preloading show />;
        }

        return (
            <div className="Form">
                {this.renderWelcome()}
                <div className="Form__Actions">
                    <Controls
                        onBack={this.handleBack}
                        onNext={this.handleNext}
                    />
                    <Change />
                </div>
            </div>
        );
    }

    render() {
        return this.renderContent();
    }
}

const mapStateToProps = state => {
    return {
        error: state.form.error,
        errorMsg: state.form.errorMsg,
        form: state.form,
        loading: state.form.loading
    };
};

export default connect(mapStateToProps, actions)(Form);
