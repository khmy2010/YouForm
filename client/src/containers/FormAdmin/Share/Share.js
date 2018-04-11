import React, { Component } from 'react';

import { connect } from 'react-redux';
import Select from '../../../components/Select/Select';
import ContextButton from '../../../components/ContextButton/CButton';
import Date from '../../Fields/Date/Date';

import * as utils from '../../../utils';

import './Share.css';

class Share extends Component {
    constructor(props) {
        super(props);

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

    componentDidMount() {
        // this.status =
    }

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
            />
        );
    }

    render() {
        return (
            <div className="Share">
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
                    <Date />
                </div>
                <div className="Share__EndDate">
                    <label>Ending Date: </label>
                    <Date />
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
        status: state.formAdmin.status
    };
};

export default connect(mapStateToProps, null)(Share);
