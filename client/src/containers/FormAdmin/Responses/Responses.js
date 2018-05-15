import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { Poll, diff, mapResponsesToQuestions, countResponses } from './helper';

import './Responses.css';
import Stats from '../../../components/Responses/Stats/Stats';
import Header from '../../../components/Responses/Header/Header';
import CountSummary from '../../../components/Responses/CountSummary/Summary';
import Field from './Field/Field';
import { findByQID } from '../../../utils';

class Responses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            responses: [],
            updated: Date.now(),
            updatedText: diff(Date.now()),
            desktop: 0,
            mobile: 0
        };
    }

    componentDidMount() {
        const url = window.location.pathname.split('/');
        this.fid = url.slice(3).shift();
        axios.get(`/api/responses/${this.fid}`).then(({ data }) => {
            axios.get(`/api/responses/${this.fid}/track`).then(res => {
                this.poll = new Poll(
                    this.fid,
                    this.sync,
                    this.updateTimestampText,
                    this.visits
                );

                this.poll.start();

                this.setState({
                    responses: data.responses,
                    desktop: res.data.desktop,
                    mobile: res.data.mobile
                });
            });
        });
    }

    componentWillUnmount() {
        //because the production environment is too slow for implementing 2 ajax at once
        //need a new architecture for this.
        if (this.poll) this.poll.end();
    }

    //this function assumes that it is an ajax with data retrieved
    sync = (data, timestamp) => {
        if (data.responses.length === 0) return null;

        this.setState((prevState, props) => {
            return {
                responses: prevState.responses.concat(data.responses),
                updated: timestamp,
                updatedText: diff(timestamp)
            };
        });
    };

    visits = data => {
        const { mobile, desktop } = data;
        const oriMobile = this.state.mobile;
        const oriDesktop = this.state.desktop;

        if (oriMobile !== mobile || oriDesktop !== desktop) {
            this.setState({
                mobile,
                desktop
            });
        }
    };

    updateTimestampText = text => {
        if (this.state.updatedText !== text) {
            this.setState({ updatedText: text });
        }
    };

    renderResponses() {
        if (this.props.loading) return null;
        const { questions } = this.props;
        const { responses } = this.state;

        const map = mapResponsesToQuestions(questions, responses);
        const count = countResponses(questions, responses);

        return questions.map(question => (
            <Field
                key={question._id}
                {...question}
                responses={map[question._id]}
                totalResponses={responses.length}
                count={count[question._id]}
            />
        ));
    }

    renderCountSummary() {
        const { questions } = this.props;
        const { responses } = this.state;

        const count = countResponses(questions, responses);
        const data = Object.keys(count).map(qid => {
            const { sequence } = findByQID(questions, qid);
            return { sequence, responses: count[qid] };
        });

        return <CountSummary data={data} total={responses.length} />;
    }

    render() {
        const { responses, desktop, mobile, updatedText } = this.state;
        return (
            <div className="Responses">
                <Stats
                    responses={responses.length}
                    desktop={desktop}
                    mobile={mobile}
                />
                <div className="Responses__Count__Summary">
                    <h3 className="Title__Mont">
                        Responses Count by Questions
                    </h3>
                    {this.renderCountSummary()}
                </div>
                <Header updated={updatedText} fid={this.fid} />
                <div className="Responses__Summary">
                    {this.renderResponses()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { questions: state.form.questions, loading: state.form.loading };
};

export default connect(mapStateToProps)(Responses);
