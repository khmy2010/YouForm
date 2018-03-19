import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../actions/form';
import Text from '../../Fields/Text/Text';

class Builder extends Component {
    state = {
        title: ''
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

    addQuestionHandler = () => {
        const question = {
            title: this.state.title
        };

        this.props.addQuestion(question, this.props.fid);
    };

    render() {
        return (
            <div>
                <h3>Form Builder</h3>
                <div>
                    <button onClick={this.addQuestionHandler}>
                        Create New
                    </button>
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
