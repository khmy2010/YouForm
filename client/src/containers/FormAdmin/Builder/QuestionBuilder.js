import React, { Component } from 'react';

import Backdrop from '../../../components/Backdrop/Backdrop';
import Button from '../../../components/Button/Button';

import EleTitle from './EleTitle';
import EleComp from './EleComp';
import ElePreview from './ElePreview';
import { CONSTS } from '../../../utils';
import { VBUILD, validateBuild } from './Validate';

import './Build.css';

const CREATING = 'CREATING';
let latestFlex = false;

class QuestionBuilder extends Component {
    constructor(props) {
        super(props);

        if (this.props.mode === CREATING) {
            this.state = {
                title: '',
                description: '',
                validation: {
                    isRequired: false
                }
            };

            if (this.props.type === CONSTS.TYPE.MULTIPLE_CHOICE) {
                this.state.options = [''];
                this.state.validation = {
                    ...this.state.validation,
                    minChoice: '',
                    maxChoice: ''
                };
            }
        } else {
            //populate with existing data
            const data = this.props.data;
            this.state = {
                title: data.title,
                description: data.description || '',
                validation: JSON.parse(data.validation)
            };

            if (this.props.type === CONSTS.TYPE.MULTIPLE_CHOICE) {
                this.state.options = data.options;
            }
        }
    }

    _handleInputChange = ({ target }) => {
        this.setState({
            [target.name]: target.value
        });
    };

    handleInputChange = ({ target }, vbuild, vfield) => {
        let fieldValidations = [];
        let vbuildResult = null;

        console.log('vbuild: ', vbuild);

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
            vbuildResult = validateBuild(
                fieldValidations,
                target.value,
                payload
            );
        }

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

    _handleInputChange = ({ target }) => {
        //read for v_field and v_build
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

    saveQuestion = () => {
        const question = {
            ...this.state,
            validation: JSON.stringify(this.state.validation),
            type: this.props.type
        };

        this.props.onBackdropClick();
        console.log(question);

        if (this.props.mode === CREATING) {
            this.props.onSave(question, this.props.fid);
        } else {
            //restore question's object ID because we will override everything.
            question._id = this.props.data._id;
            this.props.onUpdate(question, this.props.fid, this.props.data._id);
        }
    };

    renderFlexContent = () => {
        if (this.props.type !== CONSTS.TYPE.MULTIPLE_CHOICE) {
            return null;
        }
        return (
            <React.Fragment>
                <EleComp
                    type="flexInput"
                    name="options"
                    displayName="Options"
                    options={this.state.options}
                    onAdd={this.addFlexInput}
                    onRemove={this.removeFlexInput}
                    onChange={this.changeFlexInput}
                    latestFlex={latestFlex}
                />
                <EleComp
                    type="inlineInput"
                    name="minChoice"
                    displayName="Minimum Choices:"
                    onInputChange={this.handleInputChange}
                    value={this.state.validation.minChoice}
                    vbuild={[VBUILD.MIN, VBUILD.NUM].join(' ')}
                    vfield
                />
                <EleComp
                    type="inlineInput"
                    name="maxChoice"
                    displayName="Maximum Choices:"
                    onInputChange={this.handleInputChange}
                    value={this.state.validation.maxChoice}
                    vbuild={[VBUILD.MAX, VBUILD.NUM].join(' ')}
                    vfield
                />
            </React.Fragment>
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
                            {this.renderFlexContent()}
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
