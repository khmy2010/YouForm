import React, { Component } from 'react';

import Backdrop from '../../../components/Backdrop/Backdrop';
import './Build.css';

class QuestionBuilder extends Component {
    render() {
        console.log('halo');
        return (
            <React.Fragment>
                <Backdrop show clicked={this.props.onBackdropClick} />
                <div
                    style={{
                        opacity: '1'
                    }}
                    className="QuestionBuilder"
                >
                    <div className="EleBuilder">
                        <div className="EleTitle">
                            1. New Short Text Question
                        </div>
                    </div>
                    <div className="ElePreview">Preview your question here</div>
                </div>
            </React.Fragment>
        );
    }
}

export default QuestionBuilder;
