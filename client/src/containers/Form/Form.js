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
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
        this.path = new helper.Path();
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     console.log(nextProps);
    // }

    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(2).shift();
        this.props.fetchForm(fid);
    }

    prev = () => {
        this.setState((prevState, props) => {
            return {
                current: this.path.getHistory(prevState.current)
            };
        });
    };

    next = (qid, type) => {
        this.setState(({ current }, { questions, responses }) => {
            //might return undefined because it is not required
            const response = helper.findCurrentResponse(qid, responses);
            let next = undefined;

            if (response !== undefined) {
                const { type, selected } = response;
                const isSingleChoice = utils.typeCheck.isSingleChoice(type);

                if (current !== 0 && isSingleChoice) {
                    next = helper.getConnected(questions, selected, current);
                    const { seqs } = helper.getConnectedAll(questions, current);
                    //remove any potential path before proceed
                    this.path.delete(seqs);
                }
            }

            this.path.add(next ? next : current + 1);

            return {
                current: next ? next : current + 1
            };
        });
    };

    shouldPrev = () => this.state.current > 1;

    shouldNext = (qid, { isRequired }) => {
        //should return a next object that contains:
        //next, review, submit
        const response = helper.findCurrentResponse(qid, this.props.responses);

        /*
            cater to non-required field:
            second check will pass IF it is not required and no response has been received.
            if response is received, it should follow the existing validation rule
        */
        return {
            isQuestion: this.state.current - this.props.questions.length <= 0,
            nextable:
                (response && response.valid) || (!response && !isRequired),
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

        //this approach uses the fact that it only mount once per question.
        const response = helper.findCurrentResponse(
            question._id,
            this.props.responses
        );

        const init = { populated: false };

        if (response && response.valid) {
            init.value = response.value;
            init.selected = response.selected;
            init.populated = true;
        }

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
                    init={init}
                />
                <Controls
                    back={this.shouldPrev()}
                    next={this.shouldNext(question._id, parsedValidation)}
                    navPrev={this.prev}
                    navNext={() => this.next(question._id, question.type)}
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
