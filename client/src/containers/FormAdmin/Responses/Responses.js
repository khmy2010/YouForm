import React, { Component } from 'react';

import axios from 'axios';
import { Poll } from './helper';

import './Responses.css';
import Stats from '../../../components/Responses/Stats/Stats';
import Header from '../../../components/Responses/Header/Header';

class Responses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            responses: []
        };
    }

    componentDidMount() {
        const url = window.location.pathname.split('/');
        this.fid = url.slice(3).shift();
        axios.get(`/api/responses/${this.fid}`).then(({ data }) => {
            this.setState({
                responses: data.responses
            });

            this.poll = new Poll(this.fid, this.sync);
            this.poll.start();
        });
    }

    //this function assumes that it is a successful ajax
    sync = data => {
        if (data.length === 0) return null;

        this.setState((prevState, props) => {
            return { responses: prevState.responses.concat(data) };
        });
    };

    render() {
        return (
            <div className="Responses">
                <Stats />
                <Header />
            </div>
        );
    }
}

export default Responses;
