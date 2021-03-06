import React, { Component } from 'react';
import shortid from 'shortid';

import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';

import EleTitle from './EleTitle';
import EleComp from './EleComp';
import ElePreview from './ElePreview';
import {
    CONSTS,
    typeCheck,
    isValidLogic,
    scanLogic,
    purify,
    getOptions
} from '../../../utils';
import { VBUILD, validateBuild } from './Validate';

//Helper functions
import Order from '../Helpers/Order';
import Date from '../Helpers/Date';
import Choices from '../Helpers/Choices';
import Logic from '../Helpers/Logic';
import Warn from '../Helpers/Warn';

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
                },
                sequence: this.props.questions.length + 1,
                originalSequence: this.props.questions.length + 1,
                isSequenceChanged: false,
                connect: []
            };

            if (typeCheck.isText(type)) {
                this.state.validation = {
                    ...this.state.validation,
                    minCharCount: '',
                    maxCharCount: ''
                };
            }

            if (typeCheck.isMultipleChoice(type)) {
                this.state.options = [{ oid: shortid.generate(), option: '' }];
                this.state.validation = {
                    ...this.state.validation,
                    minChoice: '',
                    maxChoice: ''
                };
            }

            if (typeCheck.isSingleChoice(type)) {
                this.state.options = [{ oid: shortid.generate(), option: '' }];
                this.state.connect = [];
            }

            if (typeCheck.isYesNo(type)) {
                this.state.options = [
                    { oid: shortid.generate(), option: 'Yes' },
                    { oid: shortid.generate(), option: 'No' }
                ];
            }

            if (typeCheck.isDate(type)) {
                this.state.dateType = '';
            }
        } else {
            //populate with existing data
            const data = this.props.data;
            this.state = {
                title: data.title,
                description: data.description || '',
                validation: JSON.parse(data.validation),
                originalSequence: data.sequence,
                sequence: data.sequence,
                isSequenceChanged: false,
                error: false,
                errorMessage: ''
            };

            if (typeCheck.isExtendedChoice(this.props.type)) {
                this.state.options = JSON.parse(data.options);
            }

            if (typeCheck.isDate(type)) {
                this.state.dateType = data.dateType;
            }

            if (typeCheck.isSingleChoice(type) && data.connect) {
                this.state.connect = JSON.parse(data.connect);
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

    handleCheckboxChange = changed => {
        const newValidation = { ...this.state.validation };
        newValidation.isRequired = changed;
        this.setState({
            validation: newValidation
        });
    };

    addFlexInput = () => {
        latestFlex = true;
        const newOptions = this.state.options.slice();
        newOptions.push({ oid: shortid.generate(), option: '' });
        this.setState({
            options: newOptions
        });
    };

    removeFlexInput = index => {
        latestFlex = false;
        const newOptions = this.state.options.slice();
        let deletedOID = null;

        //If only one element is removed, an array of one element is returned.
        //from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        if (index > -1) deletedOID = newOptions.splice(index, 1);

        if (typeCheck.isSingleChoice(this.props.type)) {
            const event = new CustomEvent('optionDeleted', {
                detail: { index }
            });

            document.dispatchEvent(event);

            this.removeLogic(deletedOID[0].oid);
        }

        this.setState({ options: newOptions });
    };

    changeFlexInput = (event, index) => {
        latestFlex = false;
        const newOptions = this.state.options.slice();
        newOptions[index].option = event.target.value;

        this.setState({
            options: newOptions
        });
    };

    removeLogic = logicKey => {
        const connect = this.state.connect.slice();

        //don't proceed if there is no logic attached.
        if (connect.length === 0) return;

        const filtered = connect.filter(({ key }) => key !== logicKey);

        this.setState({ connect: filtered });
    };

    handleSelectionChange = data => {
        this.setState({
            dateType: data
        });
    };

    addLogic = logic => {
        const newConnect = this.state.connect.concat(logic);
        this.setState({ connect: newConnect });
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
                ({ option }) => option.trim().length !== 0
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
        delete question.originalSequence;
        delete question.error;
        delete question.errorMessage;

        //stringify the validation after it has been sanitised.
        question.validation = JSON.stringify(this.state.validation);

        if (this.state.connect) {
            question.connect = JSON.stringify(this.state.connect);
        }

        if (question.options) {
            question.options = JSON.stringify(this.state.options);
        }

        //verify logics
        if (typeCheck.isSingleChoice(this.props.type) && this.state.connect) {
            if (this.state.isSequenceChanged) {
                const res = scanLogic(
                    this.props.questions,
                    this.getValidSequence(),
                    this.state.connect
                );

                if (!res) {
                    question.connect = JSON.stringify(
                        purify(
                            this.props.questions,
                            this.getValidSequence(),
                            this.state.connect
                        )
                    );
                }
            }
        }

        this.props.onBackdropClick();

        if (this.props.mode === CREATING) {
            if (this.state.isSequenceChanged) {
                this.props.onAddAndUpdateSeq(
                    question,
                    this.props.fid,
                    this.state.sequence
                );
            } else this.props.onSave(question, this.props.fid);
        } else {
            //restore question's object ID because we will override everything.
            question._id = this.props.data._id;
            if (this.state.isSequenceChanged) {
                this.props.onEditAndDeleteSeq(
                    question,
                    this.props.fid,
                    this.props.data._id,
                    this.state.sequence,
                    this.state.originalSequence
                );
            } else
                this.props.onUpdate(
                    question,
                    this.props.fid,
                    this.props.data._id
                );
        }
    };

    changeOrder = index => {
        //do not process if value is the same
        if (this.state.originalSequence === index + 2) {
            this.checkLogic();
            this.setState({ isSequenceChanged: false });
            return;
        }

        //+1 for not zero indexed
        //(1-1+1)
        const situation = this.state.originalSequence - (index + 1);

        this.setState(
            {
                sequence: situation > 0 ? index + 2 : index + 1,
                isSequenceChanged: true
            },
            this.checkLogic
        );
    };

    checkLogic = () => {
        if (!this.isLogicEnabled()) return;

        const res = scanLogic(
            this.props.questions,
            this.getValidSequence(),
            this.state.connect
        );

        if (this.state.error !== !res)
            this.setState({
                error: !res,
                errorMessage:
                    'Some logic might be removed upon save due to recent changes.'
            });
    };

    //function to get valid sequence for processing
    getValidSequence = () => {
        const { isSequenceChanged, sequence, originalSequence } = this.state;

        return isSequenceChanged ? sequence : originalSequence;
    };

    isLogicEnabled = () => {
        if (!typeCheck.isSingleChoice(this.props.type)) return false;
        if (this.state.connect === undefined) return false;
        return true;
    };

    renderLogic = () => {
        if (!this.isLogicEnabled()) return null;

        //get valid sequence
        const sequence = this.getValidSequence();

        //check if all connects are valid
        const checked = this.state.connect.filter(({ qid }) =>
            isValidLogic(sequence, qid, this.props.questions)
        );

        return (
            <Logic
                type={this.props.type}
                questions={this.props.questions}
                options={this.state.options}
                connect={checked}
                sequence={sequence}
                onAdd={this.addLogic}
                onRemove={this.removeLogic}
            />
        );
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
                                options={getOptions(this.state.options)}
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
                                ori={this.state.originalSequence}
                            />
                            {this.renderLogic()}
                            <Warn
                                show={this.state.error}
                                msg={this.state.errorMessage}
                            />
                        </div>
                        <div className="EleFooter">
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
