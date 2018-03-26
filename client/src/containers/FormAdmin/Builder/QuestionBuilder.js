import React, { Component } from 'react';

import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';

import EleTitle from './EleTitle';
import EleComp from './EleComp';
import ElePreview from './ElePreview';

import './Build.css';

class QuestionBuilder extends Component {
    state = {
        title: '',
        description: '',
        validation: {
            isRequired: false
        }
    };

    handleInputChange = ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
    };

    handleCheckboxChange = ({ target }) => {
        const newValidation = { ...this.state.validation };
        newValidation.isRequired = target.checked;
        this.setState({
            validation: newValidation
        });
    };

    saveQuestion = () => {
        const question = {
            ...this.state,
            validation: JSON.stringify(this.state.validation),
            type: this.props.type
        };
        this.props.onSave(question, this.props.fid);
        this.props.onBackdropClick();
    };

    render() {
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
                        <EleTitle type={this.props.type} />
                        <div className="EleBody">
                            <EleComp
                                type="input"
                                name="title"
                                displayName="Title"
                                value={this.state.title}
                                onInputChange={this.handleInputChange}
                            />
                            <EleComp
                                type="input"
                                name="description"
                                displayName="Description"
                                value={this.state.description}
                                onInputChange={this.handleInputChange}
                            />
                            <EleComp
                                type="checkbox"
                                id="required"
                                name="required"
                                displayName="Required"
                                value={this.state.validation.isRequired}
                                onCheckboxChange={this.handleCheckboxChange}
                            />
                        </div>
                        <div className="EleFooter">
                            <Button>Save to stencils</Button>
                            <Button clicked={this.props.onBackdropClick}>
                                Cancel
                            </Button>
                            <Button clicked={this.saveQuestion}>Save</Button>
                        </div>
                    </div>
                    <ElePreview
                        type={this.props.type}
                        title={this.state.title}
                        description={this.state.description}
                        validation={this.state.validation}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default QuestionBuilder;
