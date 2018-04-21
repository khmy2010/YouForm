import React, { Component } from 'react';

import axios from 'axios';

import './DevTools.css';

import * as lib from './testLib';
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

        if (fid) {
            localStorage.setItem('__fid', fid);

            this.setState({
                fid,
                state,
                output: `FID ${fid} stored in local storage.`
            });
        }
    };

    mockQuestions = async () => {
        try {
            const res = await axios.post(`/test/${this.state.fid}/questions`);

            this.setState({
                output: lib.beautify(res.data.questions)
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

    checkLogic = async () => {
        const res = await axios.get(`/test/${this.state.fid}/questions`);

        //make sure for every options available, there is a matching question
        const tests = [];

        const questions = res.data;

        questions.forEach(({ type, options, sequence, connect, _id }) => {
            if (utils.typeCheck.isSingleChoice(type)) {
                //before JSON.parse, if empty, it will be []
                if (connect && connect.length > 2) {
                    const parsed = JSON.parse(connect);
                    const ret = { logics: parsed, options, sequence, qid: _id };
                    tests.push(ret);
                }
            }
        });

        if (tests.length === 0) {
            this.setState({ output: 'Nothing to test. Mehhh' });
            return;
        }

        let result = true;

        tests.forEach(({ logics, options, sequence }) => {
            const max = options.length - 1;

            logics.forEach(({ key, qid }) => {
                //first check: make sure the key don't salah
                if (key > max) result = false;

                //second check: make sure connected QID exist
                if (!lib.isExist(qid, questions)) result = false;

                //third check: make sure connected QID is behind
                if (!lib.isBehind(qid, questions, sequence)) result = false;
            });

            //fourth check: make sure the sequence is not the LAST and LARGER than length
            if (sequence >= questions.length) result = false;
        });

        if (result) this.setState({ output: 'Logic Test PASS! Gong Xi!' });
        else this.setState({ output: 'Logic Test Failed!' });
    };

    deleteRandom = async () => {
        const res = await axios.get(`/test/${this.state.fid}/questions`);
        const questions = res.data;
        const fid = this.state.fid;

        //delete finish lo
        if (questions.length === 1) lib.deleteOne(fid, questions[0]._id);

        //if two questions left
        if (questions.length === 2) lib.deleteOne(fid, questions[1]._id);

        //more than three questions left
        if (questions.length > 2) {
            const index = lib.getRand(0, questions.length - 1);
            const res = await lib.deleteOne(fid, questions[index]._id);

            this.setState({
                output: `DELETED INDEX: ${index} \n ${lib.beautify(res)}`
            });
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
                        <button onClick={this.deleteRandom}>
                            Delete Random
                        </button>
                        <button onClick={this.viewAPI}>View API Data</button>
                    </div>
                </section>
                <section className="actions">
                    <h2>Validation and Testing</h2>
                    <div className="Dev__Buttons">
                        <button onClick={this.checkSequence}>
                            Validate SEQ
                        </button>
                        <button onClick={this.checkLogic}>
                            Validate Logic
                        </button>
                    </div>
                </section>
                <div className="Dev__Outputs">
                    <h2>Outputs</h2>
                    <div id="bar">
                        <div id="red" />
                        <div id="yellow" />
                        <div id="green" />
                    </div>
                    <div id="screen">
                        <textarea
                            className="font"
                            value={this.state.output}
                            readOnly
                            rows="25"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default DevTools;
