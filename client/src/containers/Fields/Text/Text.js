import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Text.css';

//Text base class
//might need to do react-props check
//https://github.com/facebook/prop-types

class Text extends Component {
    state = {
        value: ''
    };

    handleChange = event => {
        this.setState({
            value: event.target.value
        });
    };

    render() {
        return (
            <div className="field">
                <p className="_label">{this.props.title}</p>
                <input
                    className="_text"
                    type="text"
                    value={this.state.value}
                    onChange={event => this.handleChange(event)}
                />
            </div>
        );
    }
}

export default connect(null)(Text);
