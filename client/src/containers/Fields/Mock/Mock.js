import React, { Component } from 'react';
import { connect } from 'react-redux';

import Field from '../Field';

class Mock extends Component {
    state = {
        value: '',
        touched: false,
        error: false
    };

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    };

    validate = event => {
        let error = false;

        const validation = this.props.validation;

        if (validation) {
            if (validation.isRequired) {
                if (this.state.value.trim().length === 0) {
                    error = true;
                } else {
                    error = false;
                }
            }
        }

        this.setState({
            error
        });
    };

    render() {
        let classes = ['_text'];
        let errorMsg = '';
        let tooltip = null;

        classes = classes.join(' ');

        const config = {
            title: this.props.title,
            description: this.props.description,
            required: this.props.validation.isRequired
        };

        return (
            <Field config={this.props}>
                <input
                    className={classes}
                    type="text"
                    value={this.state.value}
                    onChange={event => this.handleChange(event)}
                    onFocus={() => this.setState({ touched: true })}
                    onBlur={event => this.validate(event)}
                />
            </Field>
        );
    }
}

export default connect(null)(Mock);
