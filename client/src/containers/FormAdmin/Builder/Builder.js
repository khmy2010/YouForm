import React, { Component } from 'react';
import { connect } from 'react-redux';

//import redux actions
import * as actions from '../../../actions/form';

import Button from '../../../components/Button/Button';
import Elements from '../../../components/FormAdmin/BuilderElement/Elements';

//import form components
import QuestionBuilder from './QuestionBuilder';
import QuestionsPreview from './Preview/Preview';

//import context components
import Context from '../../ContextDialog/Context';
import Stencils from '../Stencils/Stencils';
import Dialog from '../../../components/Dialog/Dialog';

//import utils library
import { typeCheck } from '../../../utils';

import axios from 'axios';

const CREATING = 'CREATING';
const EDITING = 'EDITING';

class Builder extends Component {
    state = {
        title: '',
        showBuilder: false,
        buildingStatus: null,
        buildingType: null,
        buildingData: null,
        showContext: false,
        showConfirmation: false,
        showStencilExplorer: false
    };

    renderQuestions() {
        const questions = this.props.questions;

        if (questions.length === 0) {
            return null;
        }

        const transformedQuestions = questions.map(question => {
            // eslint-disable-next-line
            let validation;
            if (question.validation) {
                validation = JSON.parse(question.validation);
            }
            return null;
        });

        return transformedQuestions;
    }

    //this function only turns on and turns off question builder
    //without knowing whether it is editing or creating
    toggleQuestionBuilder = () => {
        this.setState((prevState, props) => {
            /*
                1. It means that we are trying to turn off the builder
                2. Therefore we need to reset the state
            */
            if (prevState.showBuilder === true) {
                return {
                    showBuilder: !prevState.showBuilder,
                    buildingType: null,
                    buildingData: null
                };
            } else {
                return {
                    showBuilder: !prevState.showBuilder
                };
            }
        });
    };

    createQuestion = type => {
        this.setState({
            buildingStatus: CREATING,
            buildingType: type
        });

        this.toggleQuestionBuilder();
    };

    editQuestion = data => {
        /*
            Notes:
            1. Currently Question Builder is not robust
            2. Need 3 states: null, new, edit to specify for different needs
            3. Need a way for QuestionBuilder to absorb existing data
        */

        /*
            Proposed new way:
            1. Builder to have a building state of:
                (i) - null (not building)
                (ii) - creating (building new)
                (iii) - editing (editing existing)

            2. QuestionBuilder to have two modes:
                (i) - creating mode 
                (ii) - editing mode

                where creating mode do what it is currently doing;
                and editing mode have difference in:
                (i) - data loaded
                (ii) - preview loaded
                (iii) - button text - "Update" instead of "Save"
        */
        this.setState({
            buildingStatus: EDITING,
            buildingType: data.type,
            buildingData: data
        });

        this.toggleQuestionBuilder();
    };

    deleteQuestion = ({ _id }) => {
        this.props.deleteQuestion(this.props.fid, _id);
    };

    toggleContext = () => {
        this.setState((prevState, props) => {
            return { showContext: !prevState.showContext };
        });
    };

    toggleStencilExplorer = () => {
        this.setState((prevState, props) => {
            return { showStencilExplorer: !prevState.showStencilExplorer };
        });
    };

    toggleSaveStencil = data => {
        this.saveStencilTarget = data ? data : null;

        this.setState((prevState, props) => {
            return { showConfirmation: !prevState.showConfirmation };
        });
    };

    saveStencil = async () => {
        if (this.saveStencilTarget === null) return;

        const data = { ...this.saveStencilTarget };
        delete data.connect;
        delete data._id;
        delete data.sequence;

        //need to parse back EMPTY connect so that it will work properly
        if (typeCheck.isExtendedChoice(data.type))
            data.connect = JSON.stringify([]);

        console.log('check: ', typeCheck.isExtendedChoice(data.type));
        console.log(data);

        this.toggleSaveStencil(); //close the dialog

        await axios.post('/api/stencils', data);
    };

    renderContext() {
        let context = null;

        if (this.state.showContext) {
            context = <Context onBackdropClick={this.toggleContext} />;
        }

        return context;
    }

    renderQuestionBuilder() {
        let questionBuilder = null;

        if (this.state.showBuilder) {
            questionBuilder = (
                <QuestionBuilder
                    onBackdropClick={this.toggleQuestionBuilder}
                    onSave={this.props.addQuestion}
                    onUpdate={this.props.editQuestion}
                    fid={this.props.fid}
                    type={this.state.buildingType}
                    mode={this.state.buildingStatus}
                    data={this.state.buildingData}
                    questions={this.props.questions}
                    onAddAndUpdateSeq={this.props.addQuestionUpdateSeq}
                    onEditAndDeleteSeq={this.props.editQuestionUpdateSeq}
                />
            );
        }

        return questionBuilder;
    }

    renderStencils() {
        if (!this.state.showStencilExplorer) return null;
        return (
            <Stencils
                show={this.state.showStencilExplorer}
                closed={this.toggleStencilExplorer}
                add={data => this.props.addQuestion(data, this.props.fid)}
                length={this.props.questions.length}
            />
        );
    }

    render() {
        return (
            <div className="Builder">
                <Elements onEleClicked={this.createQuestion}>
                    <Button
                        className="Elements__Stencils"
                        clicked={this.toggleStencilExplorer}
                    >
                        Import from Stencils
                    </Button>
                    <Button
                        className="Element__Context"
                        clicked={this.toggleContext}
                    >
                        Form Welcome / Thank Screen
                    </Button>
                    {this.renderQuestionBuilder()}
                    {this.renderContext()}
                </Elements>
                <QuestionsPreview
                    onEdit={this.editQuestion}
                    onDelete={this.deleteQuestion}
                    questions={this.props.questions}
                    onSaveStencil={this.toggleSaveStencil}
                />
                <Dialog
                    show={this.state.showConfirmation}
                    cancel={() => this.toggleSaveStencil()}
                    okay={this.saveStencil}
                    otext="Save"
                    title="Save this into stencils?"
                >
                    This will save the question into your list of stencils. You
                    can then reuse it in other forms.
                </Dialog>
                {this.renderStencils()}
            </div>
        );
    }
}

const mapStateToProps = ({ form }) => {
    return {
        questions: form.questions,
        fid: form.fid
    };
};

export default connect(mapStateToProps, actions)(Builder);
