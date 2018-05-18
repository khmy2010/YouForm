import React, { Component } from 'react';

import './Feedbacks.css';

import CheckBox from '../../../components/CheckBox/CheckBox';

class Feedbacks extends Component {
    seeLatest(status) {
        console.log(status);
    }
    render() {
        return (
            <div className="Feedbacks">
                <div className="Feedbacks__Control">
                    <CheckBox
                        label="See feedbacks without responses"
                        changed={this.seeLatest}
                    />
                </div>
            </div>
        );
    }
}

export default Feedbacks;
