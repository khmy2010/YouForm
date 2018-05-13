import React, { PureComponent } from 'react';

import Backdrop from '../Backdrop/Backdrop';
import Button from '../ContextButton/CButton';

import './Dialog.css';

/*
    props list:
    1. show [must]
    2. cancel [must]
    3. ctext
    4. otext
    5. okay [must]
    6. buttons
*/
class Dialog extends PureComponent {
    renderButtons() {
        const { ctext, otext } = this.props;
        const buttons = [];
        buttons.push(
            <Button
                key="Cancel"
                clicked={this.props.cancel}
                context="CButton__Red"
            >
                {ctext ? ctext : 'Cancel'}
            </Button>
        );

        buttons.push(
            <Button key="Okay" clicked={this.props.okay}>
                {otext ? otext : 'Okay'}
            </Button>
        );

        let renderedButtons = [];

        //remember to set a key for <Button />
        if (this.props.buttons) renderedButtons.concat(this.props.button);
        else renderedButtons = buttons.slice();

        return renderedButtons;
    }

    render() {
        const { show, cancel, title, children } = this.props;
        if (!this.props.show) return null;

        return (
            <React.Fragment>
                <Backdrop show={show} clicked={cancel} />
                <div className="Dialog">
                    <div className="Dialog__Title">{title}</div>
                    <div className="Dialog__Body">{children}</div>
                    <div className="Dialog__Footer">{this.renderButtons()}</div>
                </div>
            </React.Fragment>
        );
    }
}

export default Dialog;
