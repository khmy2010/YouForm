import React, { Component } from 'react';

import axios from 'axios';

import Dialog from '../Dialog/Dialog';
import Button from '../ContextButton/CButton';
import { getBase } from '../../utils';
import * as checker from '../../containers/Fields/checker';

import './Share.css';

class Share extends Component {
    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            sent: false,
            emails: '',
            validEmails: [],
            sentable: false
        };
        this.linkField = React.createRef();
    }

    copyLink = () => {
        this.linkField.current.select();
        document.execCommand('Copy');
        this.setState({ copied: true });

        //disable the button to give an impression of copied for 2 seconds
        setTimeout(() => this.setState({ copied: false }), 2000);
    };

    handleEmails = evt => {
        const emails = evt.target.value;
        let valid = true;
        const parsed = emails
            .trim()
            .replace(/\s/g, '')
            .split(',')
            .filter(email => email.trim().length > 0);

        parsed.forEach(email => {
            if (!checker.email(email)) valid = false;
        });

        const filtered = parsed.filter(email => checker.email(email));

        this.setState({
            emails,
            sentable: valid,
            validEmails: filtered
        });
    };

    sendEmail = async () => {
        const { formData } = this.props;
        this.setState({ sent: true });

        //this is going to took a while
        await axios.post('/api/email/promo', {
            to: this.state.validEmails,
            subject: `${formData.name} - Insight needed`,
            fid: this.props.fid
        });
    };

    render() {
        const { fid } = this.props;
        if (fid === null || fid === undefined) return null;

        return (
            <Dialog {...this.props} title="Share Public Link">
                <div className="Dialog__Flex">
                    <input
                        ref={this.linkField}
                        type="text"
                        value={`${getBase()}/forms/${fid}`}
                        readOnly
                    />
                    <Button clicked={this.copyLink} state={this.state.copied}>
                        {this.state.copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
                <span className="Dialog__Desc">
                    Share through email (separate each email by comma [e.g.
                    a@mail.com, b@mail.com])
                </span>
                <div className="Dialog__Flex">
                    <input
                        type="text"
                        value={this.state.emails}
                        onChange={this.handleEmails}
                    />
                    <Button
                        clicked={this.sendEmail}
                        state={
                            this.state.validEmails.length === 0 ||
                            !this.state.sentable ||
                            this.state.sent
                        }
                    >
                        {this.state.sent ? 'Sent' : 'Send'}
                    </Button>
                </div>
            </Dialog>
        );
    }
}

export default Share;
