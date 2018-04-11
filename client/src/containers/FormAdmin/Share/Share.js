import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../actions/form';

import Select from '../../../components/Select/Select';
import ContextButton from '../../../components/ContextButton/CButton';
import Date from '../../Fields/Date/Date';

import * as utils from '../../../utils';

import './Share.css';

class Share extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: null,
            startingDate: null,
            endingDate: null,
            statusChanged: false,
            startingDateChanged: false,
            endingDateChanged: false
        };

        this.linkField = null;

        this.setLinkField = element => {
            this.linkField = element;
        };

        this.copyLinkField = () => {
            if (this.linkField) {
                this.linkField.select();
                document.execCommand('Copy');
            }
        };
    }

    handleStatusChange = renderedStatus => {
        const status = renderedStatus === 'Receiving' ? true : false;

        this.setState({
            statusChanged: this.props.status !== status,
            status
        });
    };

    onDateChange = (data, type) => {
        if (data.valid && data.touched) {
        }
    };

    save = () => {
        const payload = {};

        //check for every fields
        if (this.state.statusChanged) {
            payload.status = this.state.status;
        }

        if (this.state.startingDateChanged) {
            payload.startingDate = this.state.startingDate;
        }

        if (this.state.endingDateChanged) {
            payload.endingDate = this.state.endingDate;
        }

        this.props.changeFormProperties(this.props.fid, payload);

        //reset every state after it is saved
        this.setState({
            statusChanged: false,
            startingDateChanged: false,
            endingDateChanged: false
        });
    };

    renderReceivingSelect() {
        if (this.props.status === undefined) return null;

        const initValue = this.props.status ? 'Receiving' : 'Closed';
        return (
            <Select
                options={[
                    { value: 'Receiving', display: 'Receiving' },
                    { value: 'Closed', display: 'Closed' }
                ]}
                init={initValue}
                clicked={this.handleStatusChange}
            />
        );
    }

    render() {
        let changeNotifierClasses = [
            'Share__ChangedAction',
            'Share__Flex__Hide'
        ];

        if (
            this.state.statusChanged ||
            this.state.startingDateChanged ||
            this.state.endingDateChanged
        ) {
            changeNotifierClasses.push('Share__Flex__Center');
        }

        changeNotifierClasses = changeNotifierClasses.join(' ');
        return (
            <div className="Share">
                <div className={changeNotifierClasses}>
                    <span>You have unsaved changes.</span>
                    <ContextButton clicked={this.save} context="CButton__Green">
                        Save Now
                    </ContextButton>
                </div>
                <div className="Share__Receive Share__Flex">
                    <label>Receiving Response: </label>
                    {this.renderReceivingSelect()}
                </div>
                <div className="Share__Link Share__Flex">
                    <label>Direct Link: </label>
                    <input
                        ref={this.setLinkField}
                        type="text"
                        value={`${utils.getBase()}/forms/${this.props.fid}`}
                        readOnly
                    />
                    <ContextButton clicked={this.copyLinkField}>
                        Copy Link
                    </ContextButton>
                </div>
                <div className="Share__StartDate">
                    <label>Starting Date: </label>
                    <Date
                        valueHook={data =>
                            this.onDateChange(data, 'startingDate')
                        }
                    />
                </div>
                <div className="Share__EndDate">
                    <label>Ending Date: </label>
                    <Date
                        valueHook={data =>
                            this.onDateChange(data, 'endingDate')
                        }
                    />
                </div>
                <div className="Share__Social">FB</div>
                <div className="Share__Social">Twitter</div>
                <div className="Share__Social">Link</div>
                <div className="Share__Social">Invite</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        fid: state.form.fid,
        status: state.formAdmin.status,
        startingDate: state.formAdmin.startingDate,
        endingDate: state.formAdmin.endingDate
    };
};

export default connect(mapStateToProps, actions)(Share);
