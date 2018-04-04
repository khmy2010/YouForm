import React, { Component } from 'react';
import { connect } from 'react-redux';

import Splash from '../../components/Splash/Splash';
import './Form.css';

class Form extends Component {
    state = {
        currentState: 0
    };

    componentDidMount() {}

    render() {
        return (
            <div className="Form">
                <Splash />
            </div>
        );
    }
}

export default connect()(Form);
