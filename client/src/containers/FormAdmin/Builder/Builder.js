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

const CREATING = 'CREATING';
const EDITING = 'EDITING';

class Builder extends Component {
    state = {
        title: '',
        showBuilder: false,
        buildingStatus: null,
        buildingType: null,
        buildingData: null,
        showContext: false
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
        console.log('alo');
        this.setState((prevState, props) => {
            return { showContext: !prevState.showContext };
        });
    };

    renderContext() {
        let context = null;

        if (this.state.showContext) {
            console.log('miw miaw miaw');
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
                />
            );
        }

        return questionBuilder;
    }

    render() {
        return (
            <div className="Builder">
                {/* <div className="Builder__Elements">
                    <Button
                        clicked={() =>
                            this.toggleQuestionBuilder(CONSTS.TYPE.SHORT_TEXT)
                        }
                    >
                        Create New Short Text
                    </Button>
                    <Button
                        clicked={() =>
                            this.toggleQuestionBuilder(CONSTS.TYPE.EMAIL)
                        }
                    >
                        Create New Email
                    </Button>
                    {questionBuilder}
                </div> */}
                <Elements onEleClicked={this.createQuestion}>
                    <Button className="Elements__Stencils">
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
                />
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
