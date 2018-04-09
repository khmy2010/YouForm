import React, { Component } from 'react';

//DDMMYYYY
//MMDDYYYY
//YYYYMMDD
import { CONSTS } from '../../../utils';
import * as checker from '../checker';
import './Date.css';

class DateInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            day: '',
            month: '',
            year: '',
            valid: false,
            touched: false,
            errorMsg: ''
        };

        this.initRef = (element, state) => {
            this[state] = element;
        };

        this.SMALL_M = ['04', '06', '09', '11'];
        this.BIG_M = ['01', '03', '05', '07', '08', '10', '12'];
        this.FEB = '02';
    }

    handleChange = ({ target }) => {
        const changed = target.name;
        let value = target.value;
        const month = this.state.month;
        const year = this.state.year;

        //only proceed if it is numeric or empty field
        if (checker.numeric(value) || value.length === 0) {
            const parsedValue = parseInt(value, 10);
            switch (changed) {
                case 'day':
                    if (value.length > 2) return;
                    //month haven't specified.
                    if (this.state.month.length === 0) {
                        if (parsedValue > 31) return;
                    } else {
                        if (this.state.month === this.FEB) {
                            if (year) {
                                const parsedYear = parseInt(year, 10);
                                const leapYear = this.isLeapYear(parsedYear);
                                if (!leapYear && parsedValue > 27) return;
                            } else {
                                if (parsedValue > 28) return;
                            }
                        } else {
                            const max = this.BIG_M.includes(month) ? 31 : 30;
                            if (parsedValue > max) return;
                        }
                    }
                    break;
                case 'month':
                    const lengthRe = /^\d{0,2}$/g;
                    if (!lengthRe.test(value)) return;
                    if (parsedValue > 1 && parsedValue < 10) {
                        value = '0' + parsedValue;
                    }
                    if (parsedValue > 12) value = '12';
                    break;
                case 'year':
                    if (value.length > 4) return;
                    break;
                default:
                    break;
            }

            this.validate(changed, value);

            this.setState({
                [changed]: value
            });
        }
    };

    validate = (changed, value) => {
        const obj = {
            day: this.state.day,
            month: this.state.month,
            year: this.state.year
        };

        obj[changed] = value;

        const day = parseInt(obj.day, 10);
        const month = parseInt(obj.month, 10);
        const year = parseInt(obj.year, 10);

        let valid = false;

        //only perform validation when all field is filled.
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const maxFeb = this.isLeapYear(year) ? 28 : 27;
            const maxDay = this.isBigMonth(obj.month) ? 31 : 30;

            if (month === 2) valid = day <= maxFeb;
            else valid = day <= maxDay;

            //only consider it is touched when year is fully filled.
            if (obj.year.length === 4) {
                this.setState({ touched: true });
            }
        }

        //if hook props is passed, call the hook
        if (this.props.hook) {
            //only consider error if all field are touched
            const passedValid = this.state.touched ? valid : true;

            this.props.hook(passedValid, "This date doesn't appear valid");
        }

        //reset validation if it is not performed, otherwise pass it.
        this.setState({ valid });
    };

    isLeapYear = year => year % 4 === 0;

    isBigMonth = month => this.BIG_M.includes(month);

    focusField = state => {
        this[state].select();
    };

    renderInputs() {
        const dateType = this.props.dateType || CONSTS.DATE_TYPE.LONG_DMY;

        let fields;

        switch (dateType) {
            case CONSTS.DATE_TYPE.LONG_DMY:
                fields = [
                    { state: 'day', placeholder: 'DD' },
                    { state: 'month', placeholder: 'MM' },
                    { state: 'year', placeholder: 'YYYY' }
                ];
                break;
            case CONSTS.DATE_TYPE.LONG_MDY:
                fields = [
                    { state: 'month', placeholder: 'MM' },
                    { state: 'day', placeholder: 'DD' },
                    { state: 'year', placeholder: 'YYYY' }
                ];
                break;
            case CONSTS.DATE_TYPE.LONG_YMD:
                fields = [
                    { state: 'year', placeholder: 'YYYY' },
                    { state: 'month', placeholder: 'MM' },
                    { state: 'day', placeholder: 'DD' }
                ];
                break;
            default:
                break;
        }

        return fields.map(({ state, placeholder }, index) => {
            const input = (
                <input
                    name={state}
                    ref={element => this.initRef(element, state)}
                    onChange={this.handleChange}
                    placeholder={placeholder}
                    key={index}
                    value={this.state[state]}
                    onFocus={() => this.focusField(state)}
                />
            );

            if (index !== fields.length - 1) {
                return <React.Fragment key={index}>{input}/</React.Fragment>;
            } else {
                return input;
            }
        });
    }

    render() {
        return <div className="Date__Input">{this.renderInputs()}</div>;
    }
}

export default DateInput;
