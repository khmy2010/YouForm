import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import Loading from '../../components/Preloading/Preloading';
import Example from '../../components/Discovery/Example/Example';

import './Discovery.css';

class Discovery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            forms: null,
            loading: true
        };
    }

    componentDidMount() {
        axios.get('/api/discover').then(res => {
            this.setState({
                forms: res.data,
                loading: false
            });
        });
    }

    renderExample() {
        const { forms, loading } = this.state;

        if (forms === null || loading) return null;
        return forms.map(form => {
            return (
                <Example
                    form={form}
                    key={form.fid}
                    history={this.props.history}
                />
            );
        });
    }

    nav = () => {
        const { auth, history } = this.props;
        history.push(auth ? '/app/dashboard' : '/app/login');
    };

    render() {
        return (
            <div className="Discovery">
                <Loading show={this.state.loading ? true : false} />
                <div className="Discovery__Header">
                    <div className="Discover__Nav">
                        <div
                            className="Nav__Home"
                            onClick={() => this.props.history.push('/')}
                        >
                            Home
                        </div>
                        <div className="Nav__CTA" onClick={this.nav}>
                            {this.props.auth ? 'Go to Dashboard' : 'Login'}
                        </div>
                    </div>
                    <div className="Discover__Header__Content">
                        <h1>There are a million ways to ask.</h1>
                        <p>
                            Discover forms baked directly from the community as
                            inspiration and help them to fill up too!
                        </p>
                    </div>
                </div>
                <div className="Discover__Forms">{this.renderExample()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(Discovery);
