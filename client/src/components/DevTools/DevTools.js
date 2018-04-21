import React, { Component } from 'react';

import axios from 'axios';

import './DevTools.css';
import * as utils from '../../utils';
import NotFound from '../NotFound/NotFound';

class DevTools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fid: '',
            state: null,
            output: ''
        };

        const storedFID = localStorage.getItem('__fid');
        if (storedFID) this.state.fid = storedFID;

        document.title = 'Control Panel';
    }

    getFid = event => {
        const url = event.target.value.split('/');
        const fid = url.slice(5).shift();
        const state = url.slice(4).shift();

        localStorage.setItem('__fid', fid);

        this.setState({
            fid,
            state,
            output: `FID ${fid} stored in local storage.`
        });
    };

    mockQuestions = async () => {
        try {
            const res = await axios.post(`/test/${this.state.fid}/questions`);
            const questions = res.data.questions;

            this.setState({
                output: JSON.stringify(questions)
            });
        } catch (e) {
            // console.log(res);
        }
    };

    deleteAll = async () => {
        try {
            const res = await axios.delete(`/test/${this.state.fid}/questions`);
            const questions = res.data.questions;

            this.setState({
                output: JSON.stringify(questions)
            });
        } catch (e) {
            // console.log(res);
        }
    };

    checkSequence = async () => {
        try {
            const res = await axios.get(`/test/${this.state.fid}/questions`);
            const questions = res.data;
            console.log(questions);

            if (questions.length === 0)
                this.setState({ output: 'no questions found.' });
            else {
                const test = questions.filter((question, index) => {
                    return question.sequence === index + 1;
                });

                if (test.length === questions.length) {
                    this.setState({ output: 'SEQUENCE TEST PASS!' });
                } else {
                    this.setState({ output: 'SEQUENCE TEST FAILED!' });
                }
            }
        } catch (e) {
            // console.log(res);
        }
    };

    viewAPI = () => {
        const fid = this.state.fid;
        if (fid) {
            window.open(
                `http://localhost:3000/test/${fid}/questions`,
                '_blank'
            );
        } else this.setState({ output: 'fid not found.' });
    };

    render() {
        if (!utils.isDev()) return <NotFound history={this.props.history} />;
        return (
            <div className="Dev">
                <h1>Where Development Happens</h1>
                <section className="fid">
                    <input
                        placeholder="link here pls"
                        onChange={this.getFid}
                        value={this.state.fid}
                    />
                </section>
                <section className="actions">
                    <h2>Operations</h2>
                    <div className="Dev__Buttons">
                        <button onClick={this.mockQuestions}>
                            Mock Questions
                        </button>
                        <button onClick={this.deleteAll}>
                            Delete Questions
                        </button>
                        <button onClick={this.viewAPI}>View API Data</button>
                        <button onClick={this.checkSequence}>
                            Validate SEQ
                        </button>
                    </div>
                </section>
                <section className="Dev__Outputs">
                    <h2>Outputs</h2>
                    <textarea rows="20" value={this.state.output} readOnly />
                </section>
            </div>
        );
    }
}

export default DevTools;
