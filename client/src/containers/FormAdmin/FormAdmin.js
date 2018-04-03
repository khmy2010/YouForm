import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions/form';
import './FormAdmin.css';

import Header from '../../components/FormAdmin/Header/Header';
import Builder from './Builder/Builder';
import Preview from './Preview/Preview';
import Responses from './Responses/Responses';
import Share from './Share/Share';

const MODE = ['build', 'preview', 'responses', 'feedbacks', 'share'];

class FormAdmin extends Component {
    state = {
        fileName: ''
    };

    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(3).shift();

        this.props.fetchFormAdmin(fid, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        const fileName = nextProps.formData.name;

        if (fileName && this.state.fileName !== fileName) {
            this.setState({
                fileName
            });
        }
    }

    handleFileNameChange = event => {
        this.setState({
            fileName: event.target.value
        });
    };

    saveFileName = fileName => {
        this.props.changeFormProperties(this.props.formData._id, {
            name: fileName
        });
    };

    renderNavigation() {
        return MODE.map(mode => {
            return (
                <li key={mode}>
                    <NavLink to={`${this.props.match.url}/${mode}`}>
                        {mode[0].toUpperCase() + mode.substring(1)}
                    </NavLink>
                </li>
            );
        });
    }

    render() {
        return (
            <div className="FormAdmin">
                <Header
                    fileName={this.state.fileName}
                    onChange={this.handleFileNameChange}
                    onSaveFileName={this.saveFileName}
                />
                <ul className="Bar">{this.renderNavigation()}</ul>
                <Switch>
                    <Route
                        path={`${this.props.match.url}/build`}
                        exact
                        component={Builder}
                    />
                    <Route
                        path={`${this.props.match.url}/preview`}
                        exact
                        component={Preview}
                    />
                    <Route
                        path={`${this.props.match.url}/responses`}
                        exact
                        component={Responses}
                    />
                    <Route
                        path={`${this.props.match.url}/share`}
                        exact
                        component={Share}
                    />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { formData: state.formAdmin };
};

export default connect(mapStateToProps, actions)(FormAdmin);
