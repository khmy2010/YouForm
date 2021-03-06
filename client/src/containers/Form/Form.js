import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import Preloading from '../../components/Preloading/Preloading';
import Welcome from '../../components/Form/Welcome/Welcome';
import Thanks from '../../components/Form/Thanks/Thanks';
import Field from '../Fields/Field';

import Modal from '../../components/Noti/Noti';
import Controls from '../../components/Form/Controls/Controls';
import Bar from '../../components/Form/Bar/Bar';
import Feedback from './Feedback/Feedback';

import * as utils from '../../utils';
import * as helper from './helper';
import Store from './Store';
import Sync from './Sync';
import Track from './Track';
import * as actions from '../../actions/public';

import './Form.css';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            submitted: false,
            resume: false,
            prompt: false,
            showQA: null
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
        new Track(fid);
        this.fid = fid;
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
            this.store.remove();
            helper.submit(this.props.fid, responses);
        }
    };

    toggleFeedback = qid => {
        this.setState({ showQA: qid ? qid : null });
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
                const { type, selectedOID } = response;
                const isSingleChoice = utils.typeCheck.isSingleChoice(type);

                if (current !== 0 && isSingleChoice) {
                    next = helper.getConnected(questions, selectedOID, current);
                    const { seqs } = helper.getConnectedAll(questions, current);
                    //remove any potential path before proceed
                    this.path.delete(seqs);
                }
            }

            // next = next ? next : current + 1;
            if (next === undefined) next = current + 1;

            const blacklist = helper.getBlackListed(
                questions,
                responses,
                this.path.trace
            );

            blacklist.forEach(blackQID => {
                const question = utils.findBySequence(questions, next);
                const qid = question._id;
                if (qid === blackQID) next = next + 1; //advance one more
            });

            this.path.add(next);
            this.syncLocal.save(questions, responses);

            return { current: next };
        });
    };

    shouldPrev = () => this.state.current > 1;

    shouldNext = (qid, { isRequired }) => {
        //should return a next object that contains:
        //next, review, submit
        const { questions, responses } = this.props;
        const response = helper.findCurrentResponse(qid, responses);
        const { submittable } = helper.verifySubmission(questions, responses);
        const blacklist = helper.getBlackListed(
            questions,
            responses,
            this.path.trace
        );
        const effectiveBlackList = helper.getEffectiveBlackList(
            blacklist,
            this.state.current,
            questions
        );

        /*
            cater to non-required field:
            second check will pass IF it is not required and no response has been received.
            if response is received, it should follow the existing validation rule
        */

        return {
            isQuestion: this.state.current - questions.length <= 0,
            isSubmitNext:
                this.state.current - questions.length === 0 ||
                questions.length -
                    this.state.current -
                    effectiveBlackList.length ===
                    0,
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
        if (this.state.current > 0) return null;

        return (
            <Welcome
                show={this.state.current}
                context={this.props.context}
                name={this.props.name}
                length={this.props.questions.length}
                clicked={this.next}
            />
        );
    }

    renderThanks() {
        if (!this.state.submitted) return null;

        return (
            <Thanks
                show={this.state.submitted}
                context={this.props.context}
                fid={this.fid}
            />
        );
    }

    //this function should decide what to render next for fields
    renderField() {
        if (this.state.current === 0 || this.state.submitted) return null;
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

        let parsedOptions = {};

        if (question.options) parsedOptions = JSON.parse(question.options);

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
            <div className="Form__Field">
                <div className="Form__Field__Count">
                    <span>Question {this.state.current} </span>
                    <span>/ {this.props.questions.length}</span>
                </div>
                <Field
                    component={question.type}
                    title={question.title}
                    description={question.description}
                    validation={parsedValidation}
                    options={parsedOptions}
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
                    showFeedback={() => this.toggleFeedback(question._id)}
                />
            </div>
        );
    }

    renderQA() {
        const active = this.state.showQA;
        if (active === null) return null;
        return (
            <Feedback
                qid={active}
                fid={this.fid}
                close={() => this.toggleFeedback()}
            />
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
            <React.Fragment>
                <div className="Form">
                    {this.renderResume()}
                    {this.renderWelcome()}
                    {this.renderField()}
                    {this.renderQA()}
                    {this.renderThanks()}
                </div>
                <Bar
                    current={this.state.current}
                    questions={this.props.questions}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return { ...state.public };
};

export default connect(mapStateToProps, actions)(Form);
