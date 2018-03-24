import React, { Component } from 'react';

import Text from './Text/Text';
import Email from './Email/Email';

import * as checker from './checker';

import { CONSTS } from '../../utils';

class Field2 extends Component {
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

        if (rules.isRequired) {
            validationResults.push({
                status: checker.required(value),
                message: 'This is a required field.'
            });
        }

        if (this.props.component === CONSTS.TYPE.EMAIL) {
            validationResults.push({
                status: checker.email(value),
                message: 'This is an invalid email.'
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
        const { title, description } = this.props;

        if (title.trim().length === 0) {
            return null;
        }

        switch (type) {
            case CONSTS.TYPE.SHORT_TEXT:
                return <Text title={title} description={description} />;
            case CONSTS.TYPE.EMAIL:
                return (
                    <Email
                        value={this.state.value}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                        errorStatus={this.state.error}
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

    render() {
        return (
            <div className="_field">
                <h3 className="_label">
                    {this.props.title}
                    {this.renderAsterisk()}
                </h3>
                <p className="Text-Description">{this.props.description}</p>
                {this.renderField(this.props.component)}
            </div>
        );
    }
}

export default Field2;
