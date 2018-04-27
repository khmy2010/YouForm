import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import Preloading from '../../components/Preloading/Preloading';
import Welcome from '../../components/Form/Welcome/Welcome';
import Controls from './Controls/Controls';
import Change from './Controls/Change/Change';

import * as actions from '../../actions/public';

import './Form.css';

class Form extends Component {
    state = {
        current: 0
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
        return (
            <div className="Form">
                <Preloading show={this.props.loading} />
                <Splash
                    show={this.props.error}
                    error={this.props.errorMsg}
                    history={this.props.history}
                />
                <Welcome
                    show={this.state.current}
                    context={this.props.context}
                    name={this.props.name}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.public.error,
        errorMsg: state.public.errorMsg,
        questions: state.public.questions,
        context: state.public.context,
        name: state.public.name,
        loading: state.public.loading
    };
};

export default connect(mapStateToProps, actions)(Form);
