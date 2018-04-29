import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import Preloading from '../../components/Preloading/Preloading';
import Welcome from '../../components/Form/Welcome/Welcome';
import Field from '../Fields/Field';

import Button from '../../components/ContextButton/CButton';
import Controls from '../../components/Form/Controls/Controls';

import * as utils from '../../utils';
import * as helper from './helper';
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

    prev = () => {
        this.setState((prevState, props) => {
            return {
                current: prevState.current - 1
            };
        });
    };

    next = () => {
        this.setState((prevState, props) => {
            return {
                current: prevState.current + 1
            };
        });
    };

    shouldPrev = () => this.state.current > 1;

    shouldNext = qid => {
        //should return a next object that contains:
        //next, review, submit
        const response = helper.findCurrentResponse(qid, this.props.responses);

        return {
            isQuestion: this.state.current - this.props.questions.length <= 0,
            nextable: response && response.valid,
            submittable: false
        };
    };

    renderWelcome() {
        if (this.state.current !== 0) return null;
        return (
            <React.Fragment>
                <Welcome
                    show={this.state.current}
                    context={this.props.context}
                    name={this.props.name}
                />
                <Button clicked={this.next}>Next</Button>
            </React.Fragment>
        );
    }

    //this function should decide what to render next for fields
    renderField() {
        if (this.state.current === 0) return null;
        //need to have a way to read value from redux
        //need to have a way to initialise the value if needed
        //need to have a way to parse the logic back
        const question = utils.findBySequence(
            this.props.questions,
            this.state.current
        );

        if (question === undefined) {
            console.error('Unable to find the next question');
            return null;
        }

        let parsedValidation = {};

        if (question.validation)
            parsedValidation = JSON.parse(question.validation);

        return (
            <React.Fragment>
                <Field
                    component={question.type}
                    title={question.title}
                    description={question.description}
                    validation={parsedValidation}
                    options={question.options}
                    dateType={question.dateType}
                    sync={question._id}
                    key={question._id}
                />
                <Controls
                    back={this.shouldPrev()}
                    next={this.shouldNext(question._id)}
                    navPrev={this.prev}
                    navNext={this.next}
                />
            </React.Fragment>
        );
    }

    render() {
        if (this.props.loading !== false)
            return <Preloading show={this.props.loading} />;

        if (this.props.error) {
            return (
                <Splash
                    show={this.props.error}
                    error={this.props.errorMsg}
                    history={this.props.history}
                />
            );
        }
        return (
            <div className="Form">
                {this.renderWelcome()}
                {this.renderField()}
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
        loading: state.public.loading,
        responses: state.public.responses
    };
};

export default connect(mapStateToProps, actions)(Form);
