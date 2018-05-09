import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../actions/public';

import InputText from './InputText/InputText';
import Choices from './Choices/Choices';
import Date from './Date/Date';
import Paragraph from './Paragraph/Paragraph';
import * as checker from './checker';
import { CONSTS, typeCheck, getOptions, getOID } from '../../utils';
import './Field.css';

class Field extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            touched: false,
            error: null,
            validation: this.props.validation,
            validationResults: [],
            selected: [],
            selectedOID: []
        };

        if (this.props.init && this.props.init.populated) {
            const { value, selected } = this.props.init;

            if (selected !== null) {
                this.state.selected = selected;
            }

            this.state.value = value;
        }
    }

    static getDerivedStateFromProps({ validation, options, sync }, prevState) {
        const updateObj = {};

        if (validation) {
            Object.keys(validation).forEach(rule => {
                if (prevState.validation[rule] !== validation[rule]) {
                    updateObj.validation = validation;
                }
            });
        }

        //reset selected state once the component got rendered
        //todo: ability to parse back options for local storage
        if (options && !sync) {
            updateObj.selected = [];
            updateObj.selectedOID = [];
        }

        if (Object.keys(updateObj).length === 0) return null;
        return updateObj;
    }

    handleInputChange = value => {
        this.setState({ value }, this.sync);
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

    handleDate = ({ valid, touched, stringDate }) => {
        if (valid && touched) {
            this.setState({ value: stringDate }, this.sync);
        }
    };

    handleSelection = index => {
        let newSelected = this.state.selected.slice();
        let newSelectedOID = this.state.selectedOID.slice();
        const chosenQID = getOID(this.props.options, index);

        if (this.state.selected.length === 0) {
            newSelected.push(index);
            newSelectedOID.push(chosenQID);
        } else {
            const foundIndex = this.state.selected.findIndex(element => {
                return index === element;
            });

            if (foundIndex > -1) {
                newSelected.splice(foundIndex, 1);
                newSelectedOID.splice(foundIndex, 1);
            } else {
                if (typeCheck.isAloneChoice(this.props.component)) {
                    newSelected = [];
                    newSelectedOID = [];
                }
                newSelected.push(index);
                newSelectedOID.push(chosenQID);
            }
        }

        this.setState(
            { selected: newSelected, selectedOID: newSelectedOID },
            this.sync
        );

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

        if (rules.minCharCount) {
            const parsed = parseInt(rules.minCharCount, 10);
            validationResults.push({
                status: checker.minLength(value, parsed),
                message: `This field requires minimum ${parsed} characters.`
            });
        }

        if (rules.maxCharCount) {
            const parsed = parseInt(rules.maxCharCount, 10);
            validationResults.push({
                status: checker.maxLength(value, parsed),
                message: `Too much! This field requires maximum ${parsed} characters.`
            });
        }

        if (component === TYPE.EMAIL) {
            validationResults.push({
                status: checker.email(value),
                message: 'This is an invalid email.'
            });
        }

        if (component === TYPE.LINK) {
            validationResults.push({
                status: checker.isValidUrl(value),
                message: 'This is an invalid link.'
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
        //TODO: MONITOR THIS AMENDMENT FOR SYNC (280418)
        error = validationResults.find(result => !result.status) || false;

        this.setState({
            error,
            validationResults
        });
    };

    validateHook = (status, message) => {
        this.setState(({ validationResults }, props) => {
            let error = null;

            const filtered = validationResults.filter(res => {
                return res.message !== message;
            });

            const newResults = filtered.concat([{ status, message }]);

            if (!status) {
                error = { status, message };
            }

            return {
                error,
                validationResults: newResults
            };
        });
    };

    sync = () => {
        //only sync when props is passed with qid
        if (!this.props.sync) return;

        const errorState = this.state.error;
        const type = this.props.component;
        const ret = {};
        let value = null;

        //sync data if it is validated correctly
        //remember to double check line 194 if the logic here appears wrong
        if (errorState === null || !errorState) {
            if (typeCheck.isExtendedChoice(type)) {
                //this approach might have shortcomings in building mode
                //because it won't reflect the changes in options correctly.
                value = this.state.selected
                    .map(selected => this.props.options[selected].option)
                    .join(', ');
            } else {
                value = this.state.value;
            }
            ret.valid = true;
        }
        //otherwise sync error status if it didn't pass validation
        else ret.valid = false;

        ret.value = value;
        ret.type = this.props.component;
        ret.qid = this.props.sync;

        //sync selected state
        const selected = this.state.selected;

        //sync OID as well
        const selectedOID = this.state.selectedOID;

        //only sync if something is selected
        ret.selected = selected.length === 0 ? null : selected;
        ret.selectedOID = selectedOID.length === 0 ? null : selectedOID;

        this.props.syncState(this.props.sync, ret);
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
            case CONSTS.TYPE.LINK:
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
            case CONSTS.TYPE.LONG_TEXT:
                return (
                    <Paragraph
                        value={this.state.value}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputBlur}
                        onFocus={this.handleInputFocus}
                        errorStatus={this.state.error}
                    />
                );
            case CONSTS.TYPE.MULTIPLE_CHOICE:
            case CONSTS.TYPE.SINGLE_CHOICE:
            case CONSTS.TYPE.YES_NO:
                return (
                    <Choices
                        type={type}
                        options={getOptions(this.props.options)}
                        clicked={this.handleSelection}
                        keys={this.state.selected}
                        min={this.state.validation.minChoice}
                        max={this.state.validation.maxChoice}
                    />
                );
            case CONSTS.TYPE.DATE:
                return (
                    <Date
                        dateType={this.props.dateType}
                        hook={this.validateHook}
                        valueHook={this.handleDate}
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

export default connect(null, actions)(Field);
