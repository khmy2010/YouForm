import React, { Component } from 'react';
import { connect } from 'react-redux';

//import consts
import { CONSTS } from '../../../utils';

//import redux actions
import * as actions from '../../../actions/form';

//import form components
import Button from '../../../components/Button/Button';
import QuestionBuilder from './QuestionBuilder';
import QuestionsPreview from './Preview';

class Builder extends Component {
    state = {
        title: '',
        building: false,
        buildingType: null
    };

    renderQuestions() {
        const questions = this.props.questions;
        console.log(questions);

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
                <div className="Builder__Elements">
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
                </div>
                <QuestionsPreview />
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
