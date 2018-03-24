import React, { Component } from 'react';
import { connect } from 'react-redux';

//import consts
import { CONSTS } from '../../../utils';

//import redux actions
import * as actions from '../../../actions/form';

//import form components
import Text from '../../Fields/Text/Text';
import Button from '../../../components/Button/Button';
import QuestionBuilder from './QuestionBuilder';

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
            let validation;
            if (question.validation) {
                validation = JSON.parse(question.validation);
            }
            return (
                <Text
                    title={question.title}
                    key={question.title}
                    description={question.description}
                    validation={validation}
                />
            );
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
            <div>
                <h3>Form Builder</h3>
                <div>
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
                {this.renderQuestions()}
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
