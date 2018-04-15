import React, { Component } from 'react';

import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';

import EleTitle from './EleTitle';
import EleComp from './EleComp';
import ElePreview from './ElePreview';
import { CONSTS, typeCheck } from '../../../utils';
import { VBUILD, validateBuild } from './Validate';

//Helper functions
import Order from '../Helpers/Order';
import Date from '../Helpers/Date';
import Character from '../Helpers/Character';
import Choices from '../Helpers/Choices';

import './Build.css';

const CREATING = 'CREATING';
let latestFlex = false;

class QuestionBuilder extends Component {
    constructor(props) {
        super(props);

        const type = this.props.type;

        if (this.props.mode === CREATING) {
            this.state = {
                title: '',
                description: '',
                validation: {
                    isRequired: false
                }
            };

            if (typeCheck.isText(type)) {
                this.state.validation = {
                    ...this.state.validation,
                    minCharCount: '',
                    maxCharCount: ''
                };
            }

            if (typeCheck.isMultipleChoice(type)) {
                this.state.options = [''];
                this.state.validation = {
                    ...this.state.validation,
                    minChoice: '',
                    maxChoice: ''
                };
            }

            if (typeCheck.isSingleChoice(type)) {
                this.state.options = [''];
                this.state.connect = [];
            }

            if (typeCheck.isYesNo(type)) {
                this.state.options = ['Yes', 'No'];
            }

            if (typeCheck.isDate(type)) {
                this.state.dateType = '';
            }

            this.state.sequence = this.props.questions.length + 1;
            this.state.isSequenceChanged = false;
        } else {
            //populate with existing data
            const data = this.props.data;
            this.state = {
                title: data.title,
                description: data.description || '',
                validation: JSON.parse(data.validation),
                sequence: data.sequence
            };

            if (typeCheck.isExtendedChoice(this.props.type)) {
                this.state.options = data.options;
            }

            if (typeCheck.isDate(type)) {
                this.state.dateType = data.dateType;
            }
        }
    }

    handleInputChange = ({ target }, vbuild, vfield) => {
        let fieldValidations = [];
        let vbuildResult = null;

        //read vbuild property to find out if this field requires validation
        if (vbuild) {
            let payload = null;
            fieldValidations = vbuild.split(' ');
            if (this.props.type === CONSTS.TYPE.MULTIPLE_CHOICE) {
                payload = {
                    [VBUILD.MIN]: 1,
                    [VBUILD.MAX]: this.state.options.length
                };
            }

            if (typeCheck.isText(this.props.type)) {
                payload = {
                    [VBUILD.MAX_CHAR]: this.state.validation.minCharCount
                };
            }
            vbuildResult = validateBuild(
                fieldValidations,
                target.value,
                payload
            );
        }

        /* Scenario 1: the field requires vbuild and it passed and it is not vfield
           Scenario 2: the field does not require vbuild and it is not vfield
        */
        if ((vbuild && vbuildResult && !vfield) || (!vbuild && !vfield)) {
            this.setState({
                [target.name]: target.value
            });
        }

        if ((vbuild && vbuildResult && vfield) || (!vbuild && vfield)) {
            const newValidation = { ...this.state.validation };
            newValidation[target.name] = target.value;
            this.setState({
                validation: newValidation
            });
        }
    };

    handleCheckboxChange = ({ target }) => {
        const newValidation = { ...this.state.validation };
        newValidation.isRequired = target.checked;
        this.setState({
            validation: newValidation
        });
    };

    addFlexInput = () => {
        latestFlex = true;
        const newOptions = this.state.options.slice();
        newOptions.push('');
        this.setState({
            options: newOptions
        });
    };

    removeFlexInput = index => {
        latestFlex = false;
        const newOptions = this.state.options.slice();

        if (index > -1) {
            newOptions.splice(index, 1);
        }

        this.setState({
            options: newOptions
        });
    };

    changeFlexInput = (event, index) => {
        latestFlex = false;
        const newOptions = this.state.options.slice();
        newOptions[index] = event.target.value;

        this.setState({
            options: newOptions
        });
    };

    handleSelectionChange = data => {
        this.setState({
            dateType: data
        });
    };

    saveQuestion = () => {
        let question = {
            ...this.state,
            type: this.props.type
        };

        //for multiple choice, we need to sanitise the options
        //because there might be empty one
        if (typeCheck.isMultipleChoice(this.props.type)) {
            const options = question.options.filter(
                option => option.trim().length !== 0
            );
            question.options = options;

            const { minChoice, maxChoice } = question.validation;

            if (minChoice === '') {
                //if there is no validation apply
                //set it to 0 (means undefined)
                question.validation.minChoice = 0;
            }

            if (maxChoice === '') {
                question.validation.maxChoice = 0;
            }
        }

        //remove unnecessarily property before saving
        delete question.isSequenceChanged;

        //stringify the validation after it has been sanitised.
        question.validation = JSON.stringify(this.state.validation);

        this.props.onBackdropClick();

        if (this.props.mode === CREATING) {
            if (this.state.isSequenceChanged) {
                console.log('My sequence is: ', this.state.sequence);
                this.props.onAddAndUpdateSeq(
                    question,
                    this.props.fid,
                    this.state.sequence
                );
            } else this.props.onSave(question, this.props.fid);
        } else {
            //restore question's object ID because we will override everything.
            question._id = this.props.data._id;
            this.props.onUpdate(question, this.props.fid, this.props.data._id);
        }
    };

    changeOrder = sequence => {
        //Check 1: if this is creating / edit mode
        //Check 2: creating: if it is default value (last question)
        //Check 3: editing: if it is the same with previous value

        if (this.props.mode === CREATING) {
            //do not process if default value is selected
            if (sequence === 999) {
                this.setState({ isSequenceChanged: false });
                return;
            }

            this.setState({
                sequence: sequence + 2,
                isSequenceChanged: true
            });
        }
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
                        <EleTitle
                            type={
                                this.props.mode === CREATING
                                    ? this.props.type
                                    : 'EDITING'
                            }
                        />
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
                            <Choices
                                type={this.props.type}
                                inputChanged={this.handleInputChange}
                                minChoice={this.state.validation.minChoice}
                                maxChoice={this.state.validation.maxChoice}
                                options={this.state.options}
                                addFlexInput={this.addFlexInput}
                                removeFlexInput={this.removeFlexInput}
                                changeFlexInput={this.changeFlexInput}
                                latestFlex={latestFlex}
                            />
                            <Date
                                type={this.props.type}
                                changed={this.handleSelectionChange}
                                dateType={this.state.dateType}
                            />
                            <Character
                                type={this.props.type}
                                changed={this.handleInputChange}
                                min={this.state.validation.minCharCount}
                                max={this.state.validation.maxCharCount}
                            />
                            <EleComp
                                type="checkbox"
                                id="required"
                                name="required"
                                displayName="Required"
                                value={this.state.validation.isRequired}
                                onCheckboxChange={this.handleCheckboxChange}
                            />
                            <Order
                                questions={this.props.questions}
                                onChange={this.changeOrder}
                            />
                        </div>
                        <div className="EleFooter">
                            <Button>Save to stencils</Button>
                            <Button clicked={this.props.onBackdropClick}>
                                Cancel
                            </Button>
                            <Button clicked={this.saveQuestion}>
                                {this.props.mode === CREATING
                                    ? 'Save'
                                    : 'Update'}
                            </Button>
                        </div>
                    </div>
                    <ElePreview type={this.props.type} {...this.state} />
                </div>
            </React.Fragment>
        );
    }
}

export default QuestionBuilder;
