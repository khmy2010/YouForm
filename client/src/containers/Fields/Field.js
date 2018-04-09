import React, { Component } from 'react';

import InputText from './InputText/InputText';
import Choices from './Choices/Choices';
import Date from './Date/Date';
import * as checker from './checker';
import { CONSTS, typeCheck } from '../../utils';
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
        let newSelected = this.state.selected.slice();

        if (this.state.selected.length === 0) {
            newSelected.push(index);
        } else {
            const foundIndex = this.state.selected.findIndex(element => {
                return index === element;
            });

            //if found
            if (foundIndex > -1) newSelected.splice(foundIndex, 1);
            else {
                if (typeCheck.isAloneChoice(this.props.component)) {
                    newSelected = [];
                }
                newSelected.push(index);
            }
        }

        this.setState({
            selected: newSelected
        });

        this.validate(this.state.value, newSelected);
    };

    validate = (value, selected) => {
        const rules = this.state.validation;
        const validationResults = [];
        const component = this.props.component;
        const { TYPE } = CONSTS;

        if (rules.isRequired && component !== TYPE.MULTIPLE_CHOICE) {
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

        if (component === TYPE.MULTIPLE_CHOICE) {
            const min = parseInt(this.state.validation.minChoice, 10);

            //check for required (more than or equal to 1)
            validationResults.push({
                status: checker.checkChoiceMin(selected, 1),
                message: `This is a required field.`
            });

            //TODO: check for MIN === MAX cases (after pristine imp.)

            //TODO: NEED TO USE PRISTINE, CAN'T SIMPLY SHOW
            validationResults.push({
                status: checker.checkChoiceMin(selected, min),
                message: `You will need to select ${min} or more.`
            });

            const max = parseInt(this.state.validation.maxChoice, 10);

            validationResults.push({
                status: checker.checkChoiceMax(selected, max),
                message: `You only need to select ${max} or less.`
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
            case CONSTS.TYPE.SINGLE_CHOICE:
            case CONSTS.TYPE.YES_NO:
                return (
                    <Choices
                        type={type}
                        options={this.props.options}
                        clicked={this.handleSelection}
                        keys={this.state.selected}
                        min={this.state.validation.minChoice}
                        max={this.state.validation.maxChoice}
                    />
                );
            case CONSTS.TYPE.DATE:
                return <Date dateType={this.props.dateType} />;
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
