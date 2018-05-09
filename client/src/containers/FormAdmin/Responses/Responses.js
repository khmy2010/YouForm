import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { Poll, diff, mapResponsesToQuestions } from './helper';

import './Responses.css';
import Stats from '../../../components/Responses/Stats/Stats';
import Header from '../../../components/Responses/Header/Header';
import Field from './Field/Field';

class Responses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            responses: [],
            updated: Date.now(),
            updatedText: diff(Date.now())
        };
    }

    componentDidMount() {
        const url = window.location.pathname.split('/');
        this.fid = url.slice(3).shift();
        axios.get(`/api/responses/${this.fid}`).then(({ data }) => {
            this.setState({
                responses: data.responses
            });

            this.poll = new Poll(this.fid, this.sync, this.updateTimestampText);
            this.poll.start();
        });
    }

    componentWillUnmount() {
        this.poll.end();
    }

    //this function assumes that it is an ajax with data retrieved
    sync = (data, timestamp) => {
        if (data.length === 0) return null;

        this.setState((prevState, props) => {
            return {
                responses: prevState.responses.concat(data),
                updated: timestamp
            };
        });
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
        console.log(map);

        return questions.map(question => (
            <Field
                key={question._id}
                {...question}
                responses={map[question._id]}
                totalResponses={responses.length}
            />
        ));
    }

    render() {
        return (
            <div className="Responses">
                <Stats responses={this.state.responses.length} />
                <Header updated={diff(this.state.updated)} />
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
