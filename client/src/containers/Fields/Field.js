import React, { Component } from 'react';

import InputText from './InputText/InputText';
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
            validationResults: []
        };
    }

    componentWillReceiveProps({ validation }) {
        if (validation) {
            Object.keys(validation).forEach(rule => {
                if (this.state.validation[rule] !== validation[rule]) {
                    this.setState({
                        validation
                    });
                }
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
