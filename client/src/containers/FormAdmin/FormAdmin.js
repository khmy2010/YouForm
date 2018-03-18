import React, { Component } from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../actions/form';
import './FormAdmin.css';

import Builder from './Builder/Builder';
import Preview from './Preview/Preview';
import Responses from './Responses/Responses';
import Share from './Share/Share';

const MODE = ['build', 'preview', 'responses', 'share'];

class FormAdmin extends Component {
    componentDidMount() {
        const url = window.location.pathname.split('/');
        const fid = url.slice(3).shift();

        this.props.fetchFormAdmin(fid, this.props.history);
    }

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
            <div>
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
                <h3>Document Name: {this.props.formData.name}</h3>
                <h3>Owned by: {this.props.formData.owner}</h3>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { formData: state.formAdmin };
};

export default connect(mapStateToProps, actions)(FormAdmin);
