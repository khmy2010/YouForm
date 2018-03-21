import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../actions/form';
import Text from '../../Fields/Text/Text';
import Button from '../../../components/Button/Button';
import QuestionBuilder from './QuestionBuilder';

class Builder extends Component {
    state = {
        title: '',
        building: false
    };

    renderQuestions() {
        const questions = this.props.questions;

        if (questions.length === 0) {
            return null;
        }

        const transformedQuestions = questions.map(question => {
            return <Text title={question.title} key={question.title} />;
        });

        return transformedQuestions;
    }

    toggleQuestionBuilder = () => {
        // const question = {
        //     title: this.state.title
        // };
        // this.props.addQuestion(question, this.props.fid);
        this.setState((prevState, props) => {
            console.log(prevState);
            return {
                building: !prevState.building
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
                />
            );
        }

        return (
            <div>
                <h3>Form Builder</h3>
                <div>
                    <Button clicked={this.toggleQuestionBuilder}>
                        Create New
                    </Button>
                    {questionBuilder}
                    <input
                        style={{ width: '200px', marginLeft: '30px' }}
                        type="text"
                        value={this.state.title}
                        onChange={event =>
                            this.setState({ title: event.target.value })
                        }
                    />
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
