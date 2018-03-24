import React, { Component } from 'react';
import { connect } from 'react-redux';

import Field from '../Field';
import * as checker from '../Checker';
import './Text.css';

class Text extends Component {
    state = {
        value: '',
        touched: false,
        error: false
    };

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
        this.validate(event.target.value);
    };

    validate = value => {
        let error = false;

        const validation = this.props.validation;

        if (validation.isRequired) {
            error = checker.required(value);
        }

        this.setState({
            error
        });
    };

    render() {
        let classes = ['_text'];
        let errorMsg = '';

        if (this.state.error) {
            classes.push('Text-Error');
            errorMsg = <p className="Text-ErrorMsg">This field is required.</p>;
        }

        classes = classes.join(' ');

        return (
            <Field config={this.props}>
                <input
                    className={classes}
                    type="text"
                    value={this.state.value}
                    onChange={event => this.handleChange(event)}
                    onFocus={() => this.setState({ touched: true })}
                    onBlur={event => this.validate(this.state.value)}
                />
                {errorMsg}
            </Field>
        );
    }
}

export default connect(null)(Text);
