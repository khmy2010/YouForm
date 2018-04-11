import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../../actions/form';

import Select from '../../../components/Select/Select';
import ContextButton from '../../../components/ContextButton/CButton';
import Date from '../../Fields/Date/Date';
import Error from '../../../assets/images/error__red.svg';

import * as utils from '../../../utils';

import './Share.css';

/*
    To-Do (11Apr)
    1. I have changed Form model at mongodb
    2. I need to make sure the reducer will get / initialise the value
    3. Need to make sure to be able to update the dates correctly
*/

class Share extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: null,
            startingDate: null,
            endingDate: null,
            statusChanged: false,
            startingDateChanged: false,
            endingDateChanged: false,
            dateError: false
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
        /*
            Check for:
            1. Valid Date
            2. Make sure it is not at the past
            3. If ED, make sure it is later than SD if any

            probably need to do strict validation
        */
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

    renderError() {
        if (!this.state.dateError) return null;

        return (
            <div className="Share__Error">
                <img src={Error} alt="Error" />
                <span>
                    This appears invalid to us. It will not saved together with
                    other settings.
                </span>
            </div>
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
                    {this.renderError()}
                </div>
                <div className="Share__EndDate">
                    <label>Ending Date: </label>
                    <Date
                        valueHook={data =>
                            this.onDateChange(data, 'endingDate')
                        }
                    />
                    {this.renderError()}
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
