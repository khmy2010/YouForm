import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import './Dash.css';
import * as actions from '../../actions/dash';

class Dash extends Component {
    state = {
        name: ''
    };

    componentDidMount() {
        this.props.fetchForms(this.props.loaded);
    }

    handleChange = event => {
        this.setState({
            name: event.target.value
        });
    };

    createNewForm = async () => {
        const formData = { name: this.state.name, updated: Date.now() };
        try {
            const res = await axios.post('/api/forms/new', formData);
            this.openForm(res.data._id);
        } catch (error) {
            console.log(error);
        }
    };

    openForm = fid => {
        this.props.history.push(`/app/admin/${fid}`);
    };

    renderForms() {
        if (this.props.forms === null) {
            return null;
        }

        const formsArray = this.props.forms.map(form => {
            return (
                <div
                    className="Dash-Form"
                    key={form._id}
                    onDoubleClick={() => this.openForm(form._id)}
                >
                    {form.name}
                </div>
            );
        });

        return formsArray;
    }

    render() {
        return (
            <div>
                <input
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={e => this.handleChange(e)}
                    style={{
                        width: '80%',
                        display: 'block',
                        marginBottom: '10px'
                    }}
                />
                <button onClick={this.createNewForm}>Create New Form</button>
                <div className="Dash-Forms-Container">{this.renderForms()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        redirect: state.formAdmin._id,
        forms: state.dash.forms,
        loaded: state.dash.count
    };
};

export default connect(mapStateToProps, actions)(withRouter(Dash));
