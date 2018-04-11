import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Context.css';

//import actions
import * as actions from '../../actions/form';

import EleComp from '../../containers/FormAdmin/Builder/EleComp';
import X from '../../assets/images/x.svg';
import Backdrop from '../../components/Backdrop/Backdrop';
import Tabs from './Tabs/Tabs';
import ContextButton from '../../components/ContextButton/CButton';
import Welcome from '../../components/Context/Welcome/Welcome';
import Thanks from '../../components/Context/Thanks/Thanks';

class Context extends Component {
    constructor(props) {
        super(props);
        const welcomeButtonText = this.props.welcome.buttonText;
        const welcomeDescription = this.props.welcome.description;

        this.state = {
            activeTab: 'Welcome Screen',
            welcomeButtonText: welcomeButtonText ? welcomeButtonText : '',
            welcomeDescription: welcomeDescription ? welcomeDescription : '',
            thanksTitle: '',
            thanksDescription: '',
            thanksButtonText: '',
            promoteSharing: ''
        };
    }

    listenKey = event => {
        if (event.keyCode === 13) {
            this.updateContext();
        }

        if (event.keyCode === 27) {
            this.props.onBackdropClick();
        }
    };

    switchTab = event => {
        this.setState({
            activeTab: event.currentTarget.dataset.tab
        });
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
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
                            name="welcomeTitle"
                            helpText="This is the form title saw by your visitor."
                            value={this.props.fileName}
                            onInputChange={this.handleChange}
                            disabled
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

    renderContextPreview() {
        let currentContext = null;

        switch (this.state.activeTab) {
            case 'Welcome Screen':
                currentContext = (
                    <Welcome
                        mode="dev"
                        title={this.props.fileName}
                        description={this.state.welcomeDescription}
                        buttonText={this.state.welcomeButtonText}
                    />
                );
                break;
            case 'Thanks Screen':
                currentContext = <Thanks />;
                break;
            default:
                break;
        }

        return <div className="Context__Preview">{currentContext}</div>;
    }

    updateContext = () => {
        const payload = {};
        if (this.state.activeTab === 'Welcome Screen') {
            payload.type = 'Welcome';
            payload.title = this.props.fileName;
            payload.description = this.state.welcomeDescription;
            payload.buttonText = this.state.welcomeButtonText;
            payload.promoteSharing = false;
        }

        if (this.state.activeTab === 'Thanks Screen') {
            payload.type = 'Thanks';
            payload.title = this.state.thanksTitle;
            payload.description = this.state.thanksDescription;
            payload.buttonText = this.state.thanksButtonText;
            payload.promoteSharing = this.state.promoteSharing || false;
        }
        this.props.updateContext(this.props.fid, payload);
        this.props.onBackdropClick();
    };

    render() {
        return (
            <React.Fragment>
                <Backdrop show clicked={this.props.onBackdropClick} />
                <div className="Context" onKeyDown={this.listenKey}>
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
                        {this.renderContextPreview()}
                    </div>
                    <div className="Context__Buttons">
                        <ContextButton clicked={this.updateContext}>
                            Save
                        </ContextButton>
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

const mapStateToProps = state => {
    return {
        fileName: state.form.name,
        fid: state.form.fid,
        welcome: state.form.context[0],
        thanks: state.form.context[1]
    };
};

export default connect(mapStateToProps, actions)(Context);
