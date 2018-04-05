import React, { Component } from 'react';

import InputText from './InputText/InputText';
import Choices from './Choices/Choices';
import * as checker from './checker';
import { CONSTS } from '../../utils';
import './Field.css';

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            touched: false,
            error: false,
            validation: this.props.validation,
            validationResults: [],
            selected: []
        };
    }

    componentWillReceiveProps({ validation, options }) {
        if (validation) {
            Object.keys(validation).forEach(rule => {
                if (this.state.validation[rule] !== validation[rule]) {
                    this.setState({
                        validation
                    });
                }
            });
        }

        //reset selected state once the component got rendered
        //todo: ability to parse back options for local storage
        if (options) {
            this.setState({
                selected: []
            });
        }
    }

    handleInputChange = value => {
        this.setState({ value });
        this.validate(value);
    };

    handleInputFocus = () => {
        this.setState({
            touched: true
        });
    };

    handleInputBlur = () => {
        this.validate(this.state.value);
        //do something here
    };

    handleSelection = index => {
        console.log('current state: ', this.state.selected);
        const newSelected = this.state.selected.slice();

        //check if the selected value has been selected before
        if (this.state.selected.length === 0) {
            newSelected.push(index);
        } else {
            const foundIndex = this.state.selected.findIndex(element => {
                return index === element;
            });

            console.log('foundIndex: ', foundIndex);

            foundIndex > -1
                ? newSelected.splice(foundIndex, 1)
                : newSelected.push(index);
        }

        console.log('handle selection: ', newSelected);

        this.setState({
            selected: newSelected
        });
    };

    validate = value => {
        const rules = this.state.validation;
        const validationResults = [];
        const component = this.props.component;
        const { TYPE } = CONSTS;

        if (rules.isRequired) {
            validationResults.push({
                status: checker.required(value),
                message: 'This is a required field.'
            });
        }

        if (component === TYPE.EMAIL) {
            validationResults.push({
                status: checker.email(value),
                message: 'This is an invalid email.'
            });
        }

        if (component === TYPE.NUMBER || component === TYPE.CURRENCY) {
            validationResults.push({
                status: checker.numeric(value),
                message: 'This field accepts only number.'
            });
        }

        if (component === TYPE.CURRENCY) {
            validationResults.push({
                status: checker.currency(value),
                message: 'This field accepts only number in two decimal places.'
            });
        }

        //loop through the results and look for ANY failed test
        let error = false;
        error = validationResults.find(result => !result.status);

        this.setState({
            error,
            validationResults
        });
    };

    renderField(type) {
        const { title } = this.props;

        if (title.trim().length === 0) {
            return null;
        }

        switch (type) {
            case CONSTS.TYPE.SHORT_TEXT:
            case CONSTS.TYPE.EMAIL:
            case CONSTS.TYPE.NUMBER:
            case CONSTS.TYPE.CURRENCY:
                return (
                    <InputText
                        value={this.state.value}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                        errorStatus={this.state.error}
                        type={type}
                    />
                );
            case CONSTS.TYPE.MULTIPLE_CHOICE:
                return (
                    <Choices
                        options={this.props.options}
                        clicked={this.handleSelection}
                        selectedKeys={this.state.selected}
                    />
                );
            default:
                return null;
        }
    }

    renderAsterisk() {
        if (this.state.validation.isRequired) {
            return (
                <span
                    className="Text-Required"
                    tooltip="Required"
                    tooltip-position="right"
                >
                    *
                </span>
            );
        }
        return null;
    }

    renderErrorMsg() {
        if (!this.state.error) {
            return null;
        }

        return this.state.error.message;
    }

    render() {
        return (
            <div className="_field">
                <h3 className="_label">
                    {this.props.title}
                    {this.renderAsterisk()}
                </h3>
                <p className="Text-Description">{this.props.description}</p>
                {this.renderField(this.props.component)}
                <small className="Field__ErrorMsg">
                    {this.renderErrorMsg()}
                </small>
            </div>
        );
    }
}

export default Field;
