import React, { Component } from 'react';
import { connect } from 'react-redux';

//import redux actions
import * as actions from '../../../actions/form';

import Elements from '../../../components/FormAdmin/BuilderElement/Elements';

//import form components
import QuestionBuilder from './QuestionBuilder';
import QuestionsPreview from './Preview/Preview';

class Builder extends Component {
    state = {
        title: '',
        building: false,
        buildingType: null
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

    toggleQuestionBuilder = type => {
        this.setState((prevState, props) => {
            return {
                building: !prevState.building,
                buildingType: type
            };
        });
    };

    editQuestion = data => {
        /*
            Notes:
            1. Currently Question Builder is not robust
            2. Need 3 states: null, new, edit to specify for different needs
            3. Need a way for QuestionBuilder to absorb existing data
        */
        console.log(data);
    };

    deleteQuestion = ({ _id }) => {
        this.props.deleteQuestion(this.props.fid, _id);
    };

    render() {
        let questionBuilder = null;

        if (this.state.building) {
            questionBuilder = (
                <QuestionBuilder
                    onBackdropClick={this.toggleQuestionBuilder}
                    onSave={this.props.addQuestion}
                    fid={this.props.fid}
                    type={this.state.buildingType}
                />
            );
        }

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
                <Elements onEleClicked={this.toggleQuestionBuilder}>
                    {questionBuilder}
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
