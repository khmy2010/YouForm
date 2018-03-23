import React, { Component } from 'react';

import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';
import Text from '../../Fields/Text/Text';
// import Email from '../../Fields/Email/Email';
// import Mock from '../../Fields/Mock/Mock';

import './Build.css';

class QuestionBuilder extends Component {
    state = {
        title: '',
        description: '',
        validation: {
            isRequired: false
        },
        type: null
    };

    eventHandler = ({ target }) => {
        if (target.type === 'checkbox') {
            const newValidation = { ...this.state.validation };
            newValidation.isRequired = target.checked;
            this.setState({
                validation: newValidation
            });
        } else {
            this.setState({
                [target.name]: target.value
            });
        }
    };

    saveQuestion = () => {
        const question = {
            ...this.state,
            validation: JSON.stringify(this.state.validation)
        };
        console.log(question);
        this.props.onSave(question, this.props.fid);
        this.props.onBackdropClick();
    };

    renderPreview() {
        if (this.state.title === '') {
            return null;
        } else {
            if (this.state.type === 1) {
                return (
                    <Text
                        title={this.state.title}
                        description={this.state.description}
                        validation={this.state.validation}
                    />
                );
            } else {
                return (
                    // <Email
                    //     title={this.state.title}
                    //     description={this.state.description}
                    //     validation={this.state.validation}
                    // />
                    <Text
                        title={this.state.title}
                        description={this.state.description}
                        validation={this.state.validation}
                    />
                );
            }
        }
    }

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
                        <div className="EleTitle">
                            1. New Short Text Question
                        </div>
                        <div className="EleBody">
                            <div className="EleField">
                                <label>Title</label>
                                <input
                                    name="title"
                                    type="text"
                                    value={this.state.title}
                                    onChange={e => this.eventHandler(e)}
                                />
                            </div>
                            <div className="EleField">
                                <label>Description</label>
                                <input
                                    name="description"
                                    type="text"
                                    value={this.state.description}
                                    onChange={e => this.eventHandler(e)}
                                />
                            </div>
                            <div className="EleCheck">
                                <input
                                    id="required"
                                    type="checkbox"
                                    name="isRequired"
                                    value={this.state.isRequired}
                                    onChange={e => this.eventHandler(e)}
                                />
                                <label htmlFor="required">
                                    <span />Required
                                </label>
                            </div>
                        </div>
                        <div className="EleFooter">
                            <Button>Save to stencils</Button>
                            <Button clicked={this.props.onBackdropClick}>
                                Cancel
                            </Button>
                            <Button clicked={this.saveQuestion}>Save</Button>
                        </div>
                    </div>
                    <div className="ElePreview">{this.renderPreview()}</div>
                </div>
            </React.Fragment>
        );
    }
}

export default QuestionBuilder;
