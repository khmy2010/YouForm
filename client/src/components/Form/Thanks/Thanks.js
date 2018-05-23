import React, { Component } from 'react';

import './Thanks.css';

import { getBase } from '../../../utils';
import linkSVG from '../../../assets/images/link.svg';
import Button from '../../ContextButton/CButton';

class Thanks extends Component {
    constructor(props) {
        super(props);
        this.linkField = React.createRef();
        this.state = {
            showNotification: false,
            copied: false
        };
    }

    copyLink = () => {
        this.linkField.current.select();
        document.execCommand('copy');
        this.setState({ copied: true });
    };

    reload = () => {
        window.location.reload();
    };

    render() {
        const { context, fid } = this.props;
        let thanksContext = null;

        if (context)
            thanksContext = context.find(({ type }) => type === 'Thanks');

        let header = 'Thank you for completing this form.';
        if (thanksContext && thanksContext.title) header = thanksContext.title;

        let description = 'Your input is very much appreciated.';
        if (thanksContext && thanksContext.description)
            description = thanksContext.description;

        return (
            <div className="Form__Thanks">
                <div className="Form__Thanks__Header">
                    <h1>{header}</h1>
                    <p>{description}</p>
                </div>
                <div className="Form__Thanks__Share">
                    <h2>Share this link to your friends!</h2>
                    <div className="Form__Thanks__Link">
                        <input
                            value={`${getBase()}/forms/${fid}`}
                            readOnly
                            ref={this.linkField}
                        />
                        <div
                            className="Form__Thanks__Copy"
                            onClick={this.copyLink}
                        >
                            <img src={linkSVG} alt="Link" />
                            {this.state.copied ? 'Copied' : 'Copy Link'}
                        </div>
                    </div>
                </div>
                <Button clicked={this.reload}>Submit another response</Button>
            </div>
        );
    }
}

export default Thanks;
