import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions/form';
import './FormAdmin.css';

import Loading from '../../components/Preloading/Preloading';
import Header from '../../components/FormAdmin/Header/Header';
import Builder from './Builder/Builder';
import Responses from './Responses/Responses';
import Share from './Share/Share';
import Feedbacks from './Feedbacks/Feedbacks';

import ErrorBoundary from '../../hocs/ErrorBoundary/ErrorBoundary';

const MODE = ['build', 'responses', 'feedbacks', 'share'];

class FormAdmin extends Component {
    state = {
        fileName: ''
    };

    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(3).shift();
        const state = url.slice(4).shift();

        let validRedirect = false;
        switch (state) {
            case 'build':
            case 'responses':
            case 'feedbacks':
            case 'share':
                validRedirect = true;
                break;
            default:
                break;
        }
        this.props.fetchFormAdmin(
            fid,
            this.props.history,
            state,
            validRedirect
        );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const fileName = nextProps.formData.name;

        if (fileName && prevState.fileName !== fileName) {
            return { fileName };
        } else {
            return null;
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
            <ErrorBoundary>
                <div className="FormAdmin">
                    <Loading
                        show={this.props.formData.loading ? true : false}
                    />
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
                            path={`${this.props.match.url}/responses`}
                            exact
                            component={Responses}
                        />
                        <Route
                            path={`${this.props.match.url}/feedbacks`}
                            exact
                            component={Feedbacks}
                        />
                        <Route
                            path={`${this.props.match.url}/share`}
                            exact
                            component={Share}
                        />
                    </Switch>
                </div>
            </ErrorBoundary>
        );
    }
}

const mapStateToProps = state => {
    return { formData: state.formAdmin };
};

export default connect(mapStateToProps, actions)(FormAdmin);
