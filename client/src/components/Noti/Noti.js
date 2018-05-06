import React, { PureComponent } from 'react';

import Backdrop from '../Backdrop/Backdrop';
import Button from '../ContextButton/CButton';
import './Noti.css';

/*
    Possible Props: 
    1. show
    2. positiveText
    3. negativeText
    4. onPositiveClick
*/
class Noti extends PureComponent {
    render() {
        if (!this.props.show) return null;

        return (
            <React.Fragment>
                <Backdrop show={this.props.show} clicked={this.props.cancel} />
                <div className="Modal__Noti" role="dialog">
                    <div className="Modal__Title">{this.props.title}</div>
                    <div className="Modal__Content">{this.props.children}</div>
                    <div className="Modal__Actions">
                        <Button
                            context="CButton__Green"
                            clicked={this.props.okay}
                        >
                            {this.props.okayText ? this.props.okayText : 'Okay'}
                        </Button>
                        <Button
                            context="CButton__Red"
                            clicked={this.props.cancel}
                        >
                            {this.props.cancelText
                                ? this.props.cancelText
                                : 'Cancel'}
                        </Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default Noti;
