import React, { Component } from 'react';

import { typeCheck } from '../../../utils';
import Button from '../../../components/Button/Button';

import Field from './LogicField';

//connect = [{key: 1, qid: blah}]
class Logic extends Component {
    state = {
        creating: false,
        if: null,
        then: null
    };

    create = () => this.setState({ creating: true });

    renderNew() {
        if (!this.state.creating) return null;
        const options = this.props.options;
        const connect = this.props.connect;
        const questions = this.props.questions;

        //check for available options
        let filteredOptions;
        if (connect.length === 0) filteredOptions = options;
        else {
            filteredOptions = options.filter((option, index) => {
                return connect.find(({ key }) => index === key) === undefined;
            });
        }

        //check for available questions (which is later than this)
        const filteredQuestions = questions.filter(({ sequence }) => {
            return sequence - this.props.sequence > 0;
        });

        //check if it is available for save
        const save = this.state.if !== null && this.state.then !== null;

        return (
            <Field
                options={filteredOptions}
                questions={filteredQuestions}
                onOptionChange={this.handleOptions}
                onQuestionChange={this.handleQuestions}
                save={save}
            />
        );
    }

    handleOptions = (display, index, value) => {
        this.setState({ if: index });
    };

    handleQuestions = (display, index, value) => {
        this.setState({ then: value });
    };

    handleChanges() {
        //call QuestionBuilder to save the logic into state
        if (this.state.creating) {
            const key = this.state.if;
            const qid = this.state.then;

            //save the entry && change to non-creating mode
            if (key !== null && qid) {
                this.props.onAdd([{ key: qid }]);
                this.setState({ creating: false });
            }
        }
    }

    renderFields() {
        const connect = this.props.connect;
        if (connect.length === 0) return null;

        // return connect.map((logic, index) => {
        //     return <Field key={index} />;
        // });
    }

    shouldRender = () => {
        const options = this.props.options;
        const type = this.props.type;
        const questions = this.props.questions;
        const sequence = this.props.sequence;

        if (!typeCheck.isSingleChoice(type)) return false;
        if (options.length === 1) return false;
        if (questions.length === 1) return false;
        //don't render if it is the last question
        if (sequence - questions.length === 1) return false;
        if (options.length === 2 && options[1].trim().length === 0)
            return false;
        return true;
    };

    renderNewButton = () => {
        const options = this.props.options;
        const connect = this.props.connect;

        if (options.length - connect.length <= 0) return null;
        if (this.state.creating) return null;

        return <Button clicked={this.create}>Add New</Button>;
    };

    render() {
        if (!this.shouldRender()) return null;
        return (
            <div className="EleField">
                <label>Logic Jump</label>
                {this.renderNewButton()}
                {this.renderNew()}
                {this.renderFields()}
            </div>
        );
    }
}

export default Logic;
