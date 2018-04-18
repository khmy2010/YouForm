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

        //check for available options
        let filteredOptions;
        if (connect.length === 0) filteredOptions = options;
        else {
            filteredOptions = options.filter((option, index) => {
                return connect.find(({ key }) => index === key) === undefined;
            });
        }

        //check for available questions
        console.log(this.props.sequence);
        return (
            <Field options={filteredOptions} questions={this.props.questions} />
        );
    }

    renderFields() {
        const connect = this.props.connect;
        if (connect.length === 0) return null;

        return connect.map((logic, index) => {
            return <Field key={index} />;
        });
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
