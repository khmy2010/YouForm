import React, { Component } from 'react';

import './Context.css';

import EleComp from '../../containers/FormAdmin/Builder/EleComp';
import X from '../../assets/images/x.svg';
import Backdrop from '../../components/Backdrop/Backdrop';
import Tabs from './Tabs/Tabs';
import ContextButton from '../../components/ContextButton/CButton';

class Context extends Component {
    state = {
        activeTab: 'Welcome Screen',
        welcomeTitle: 'Alo There',
        welcomeDescription: '',
        welcomeButtonText: '',
        thanksTitle: '',
        thanksDescription: '',
        thanksButtonText: ''
    };

    switchTab = event => {
        this.setState({
            activeTab: event.currentTarget.dataset.tab
        });
    };

    handleChange = event => {
        console.log('name: ', event.target.name);
        console.log('value: ', event.target.value);
    };

    renderControls() {
        let content = null;

        switch (this.state.activeTab) {
            case 'Welcome Screen':
                content = (
                    <React.Fragment>
                        <EleComp type="bigHelp">
                            Welcome page shows up whenever someone visits your
                            form.
                        </EleComp>
                        <EleComp
                            type="input"
                            displayName="Title"
                            name="welcometitle"
                            helpText="This is the form title saw by your visitor. Leave blank if you want to use the document title."
                            value={this.state.welcomeTitle}
                            onInputChange={this.handleChange}
                        />
                        <EleComp
                            type="input"
                            displayName="Description"
                            name="welcomeDescription"
                            helpText="Let your visitor knows more about your form before they start!"
                            value={this.state.welcomeDescription}
                            onInputChange={this.handleChange}
                        />
                        <EleComp
                            type="input"
                            displayName="Button Text"
                            name="welcomeButtonText"
                            helpText="Customise your button text to your need."
                            value={this.state.welcomeButtonText}
                            onInputChange={this.handleChange}
                        />
                    </React.Fragment>
                );
                break;
            case 'Thanks Screen':
                content = (
                    <React.Fragment>
                        <EleComp type="bigHelp">
                            Thanks page shows up whenever someone finished
                            filling your form.
                        </EleComp>
                        <EleComp
                            type="input"
                            displayName="Title"
                            name="thanksTitle"
                            helpText="Show them your big appreciation after they finished filling your form."
                            value={this.state.thanksTitle}
                            onInputChange={this.handleChange}
                        />
                        <EleComp
                            type="input"
                            displayName="Description"
                            name="thanksDescription"
                            helpText="Encourage people to share your form or visit another webpage with a custom thank you message."
                            value={this.state.thanksDescription}
                            onInputChange={this.handleChange}
                        />
                        <EleComp
                            type="input"
                            displayName="Button Text"
                            name="thanksButtonText"
                            helpText="Customise your button text to your need."
                            value={this.state.thanksButtonText}
                            onInputChange={this.handleChange}
                        />
                    </React.Fragment>
                );
                break;
            default:
                break;
        }

        return <div className="Context__Controls">{content}</div>;
    }

    render() {
        return (
            <React.Fragment>
                <Backdrop show clicked={this.props.onBackdropClick} />
                <div className="Context">
                    <div className="Context__Tabs">
                        <Tabs
                            clicked={this.switchTab}
                            activeTab={this.state.activeTab}
                        />
                        <img
                            src={X}
                            alt="Close"
                            onClick={this.props.onBackdropClick}
                        />
                    </div>
                    <div className="Context__Content">
                        {this.renderControls()}

                        <div className="Context__Preview" />
                    </div>
                    <div className="Context__Buttons">
                        <ContextButton>Save</ContextButton>
                        <ContextButton
                            context="CButton__Red"
                            clicked={this.props.onBackdropClick}
                        >
                            Cancel
                        </ContextButton>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Context;
