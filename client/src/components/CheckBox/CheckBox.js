import React, { Component } from 'react';

import shortID from 'shortid';

import './CheckBox.css';

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.init || false
        };
        this.id = shortID.generate();
    }

    changed = () => {
        const checked = this.state.checked;

        this.setState({ checked: !checked });
        this.props.changed(!checked);
    };

    render() {
        return (
            <div className="CheckBox">
                <input
                    type="checkbox"
                    checked={this.state.checked}
                    onChange={this.changed}
                    id={this.id}
                />
                <label htmlFor={this.id}>{this.props.label}</label>
            </div>
        );
    }
}

export default CheckBox;
