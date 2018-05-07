import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import Preloading from '../../components/Preloading/Preloading';
import Welcome from '../../components/Form/Welcome/Welcome';
import Field from '../Fields/Field';

import Button from '../../components/ContextButton/CButton';
import Modal from '../../components/Noti/Noti';
import Controls from '../../components/Form/Controls/Controls';

import * as utils from '../../utils';
import * as helper from './helper';
import Store from './Store';
import Sync from './Sync';
import * as actions from '../../actions/public';

import './Form.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            submitted: false,
            resume: false,
            prompt: false
        };
        this.path = new helper.Path();
        this.prompted = false;
    }

    componentDidUpdate() {
        //there is pending local storage to be processed
        //only ask for first time, otherwise infinite loop
        if (!this.prompted && this.props.loadable) {
            this.prompted = true;
            this.setState({ prompt: true });
        }
    }

    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(2).shift();
        this.store = new Store(`_form_${fid}`);
        this.props.fetchForm(fid, this.store);
        this.syncLocal = new Sync(this.store);
    }

    resume = () => {
        this.props.resume();
        this.setState({
            prompt: false
        });
    };

    discard = () => {
        this.store.remove();
        this.setState({
            prompt: false
        });
    };

    trigger = (qid, type, { isQuestion, isSubmitNext }) => {
        const { submittable, responses } = helper.verifySubmission(
            this.props.questions,
            this.props.responses
        );

        if (isQuestion && !isSubmitNext) {
            this.next(qid, type);
            return;
        }

        if (isSubmitNext && submittable && !this.state.submitted) {
            this.setState({ submitted: true });
            helper.submit(this.props.fid, responses);
        }
    };

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
            this.syncLocal.save(questions, responses);

            return {
                current: next ? next : current + 1
            };
        });
    };

    shouldPrev = () => this.state.current > 1;

    shouldNext = (qid, { isRequired }) => {
        //should return a next object that contains:
        //next, review, submit
        const { questions, responses } = this.props;
        const response = helper.findCurrentResponse(qid, responses);
        const { submittable } = helper.verifySubmission(questions, responses);

        /*
            cater to non-required field:
            second check will pass IF it is not required and no response has been received.
            if response is received, it should follow the existing validation rule
        */

        return {
            isQuestion: this.state.current - questions.length <= 0,
            isSubmitNext: this.state.current - questions.length === 0,
            nextable:
                (response && response.valid) || (!response && !isRequired),
            submittable
        };
    };

    renderResume() {
        if (!this.state.prompt) return null;
        const time = new Date(this.props.savedAt);

        return (
            <Modal
                show
                title="We saw you before..."
                okayText="Load"
                cancelText="Discard"
                okay={this.resume}
                cancel={this.discard}
            >
                Do you want to load the progress you made at
                {' ' + time.toDateString()}, during {time.toTimeString()}?
            </Modal>
        );
    }

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

        const shouldNext = this.shouldNext(question._id, parsedValidation);

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
                    next={shouldNext}
                    navPrev={this.prev}
                    navNext={() =>
                        this.trigger(question._id, question.type, shouldNext)
                    }
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
                {this.renderResume()}
                {this.renderWelcome()}
                {this.renderField()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { ...state.public };
};

export default connect(mapStateToProps, actions)(Form);
