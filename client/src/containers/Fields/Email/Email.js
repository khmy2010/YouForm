import React, { Component } from 'react';

class Email extends Component {
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

        if (this.state.error) {
            classes.push('Text-Error');
            errorMsg = <p className="Text-ErrorMsg">This field is required.</p>;
        }

        if (this.props.validation.isRequired) {
            tooltip = (
                <span
                    className="Text-Required"
                    tooltip="This is a required question"
                    tooltip-position="right"
                >
                    *
                </span>
            );
        }

        classes = classes.join(' ');

        return (
            <div className="field">
                <h3 className="_label">
                    {this.props.title}
                    {tooltip}
                </h3>
                <p className="Text-Description">{this.props.description}</p>
                <input
                    className={classes}
                    type="text"
                    value={this.state.value}
                    onChange={event => this.handleChange(event)}
                    onFocus={() => this.setState({ touched: true })}
                    onBlur={event => this.validate(event)}
                />
                {errorMsg}
            </div>
        );
    }
}

export default Email;
