import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Form.css';

class Form extends Component {
    state = {
        currentState: 0
    };

    componentDidMount() {}

    render() {
        return (
            <div className="Form">
                <h1>Alo Form</h1>
            </div>
        );
    }
}

export default connect()(Form);
