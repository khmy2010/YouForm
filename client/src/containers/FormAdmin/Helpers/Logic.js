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

    listenOptionChange = ({ detail: { index } }) => {
        //option deleted, remove that.
        if (index === this.state.if) this.setState({ if: null });
    };

    componentDidMount() {
        document.addEventListener('optionDeleted', this.listenOptionChange);
    }

    componentWillUnmount() {
        document.removeEventListener('optionDeleted', this.listenOptionChange);
    }

    create = () => this.setState({ creating: true });

    filterOptions = logicKey => {
        const options = this.props.options;
        const connect = this.props.connect || [];

        if (connect.length === 0) return options;

        return options.filter((option, index) => {
            //to include its own option
            if (logicKey !== undefined && index === logicKey) return true;
            return connect.find(({ key }) => index === key) === undefined;
        });
    };

    filterQuestions = () =>
        this.props.questions.filter(({ sequence }) => {
            return sequence - this.props.sequence > 0;
        });

    remove = removedKey => {
        if (removedKey === 'new') {
            this.setState({
                creating: false,
                if: null,
                then: null
            });
        }
        //call QuestionBuilder to remove the option
        else {
        }
    };

    renderFields() {
        //pre render check for creating && connect length
        const connect = this.props.connect || [];
        const creating = this.state.creating;

        if (!creating && connect.length === 0) return null;

        //array of <Field /> elements waiting for rendered
        const fields = [];

        //should render the field that is creating now if any
        if (this.state.creating) {
            //check if it is available for save
            const save = this.state.if !== null && this.state.then !== null;

            fields.push(
                <Field
                    options={this.filterOptions()}
                    questions={this.filterQuestions()}
                    onOptionChange={this.handleOptions}
                    onQuestionChange={this.handleQuestions}
                    save={save}
                    onSave={this.handleChanges}
                    key="new"
                    index="new"
                    remove={this.remove}
                />
            );
        }

        //should render the rest of field if any
        if (connect.length === 0) return fields;

        const connected = connect.map(({ key, qid }, seq) => {
            return (
                <Field
                    options={this.filterOptions(key)}
                    questions={this.filterQuestions()}
                    key={key}
                    index={key}
                    seq={seq}
                    selectedOption={this.props.options[key]}
                    qid={qid}
                    remove={this.remove}
                />
            );
        });

        return fields.concat(connected);
    }

    renderNew() {
        if (!this.state.creating) return null;

        //check for available options
        const filteredOptions = this.filterOptions();

        //check for available questions (which is later than this)
        const filteredQuestions = this.filterQuestions();

        //check if it is available for save
        const save = this.state.if !== null && this.state.then !== null;

        return (
            <Field
                options={filteredOptions}
                questions={filteredQuestions}
                onOptionChange={this.handleOptions}
                onQuestionChange={this.handleQuestions}
                save={save}
                onSave={this.handleChanges}
            />
        );
    }

    handleOptions = (display, index, value) => {
        this.setState({ if: index });
    };

    handleQuestions = (display, index, value) => {
        this.setState({ then: value });
    };

    handleChanges = () => {
        //call QuestionBuilder to save the logic into state
        if (this.state.creating) {
            const key = this.state.if;
            const qid = this.state.then;

            //save the entry && change to non-creating mode
            if (key !== null && qid) {
                this.props.onAdd([{ key, qid }]);
                this.setState({ creating: false });
            }
        }
    };

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
        const connect = this.props.connect || [];

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
                {this.renderFields()}
            </div>
        );
    }
}

export default Logic;
