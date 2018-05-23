import React, { Component } from 'react';

import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';

import './Feedbacks.css';

// import CheckBox from '../../../components/CheckBox/CheckBox';
import Button from '../../../components/ContextButton/CButton';
import Topic from '../../../components/Feedbacks/Topic/Topic';
import TimelineItem from '../../../components/Feedbacks/Timeline/Timeline';
import * as actions from '../../../actions/feedback';
import * as helper from './helper';
import { parseDate } from '../../../utils';
import LoadingGIF from '../../../assets/images/loading.gif';

class Feedbacks extends Component {
    state = {
        showing: null,
        response: '',
        ajaxing: false
    };

    componentDidMount() {
        const url = window.location.pathname.split('/');
        this.fid = url.slice(3).shift();

        this.props.fetchAllFeedbacks(this.fid);
    }

    toggleTopic = tid => {
        const { showing } = this.state;
        if (tid === undefined && showing !== null)
            this.setState({ showing: null });
        else {
            this.setState({ showing: tid });
        }
    };

    handleResponse = evt => {
        this.setState({ response: evt.target.value });
    };

    send = async topic => {
        const { question, _id } = topic;
        const { response } = this.state;
        const { name, adminReply } = this.props;
        this.setState({ ajaxing: true });
        await adminReply(this.fid, question, _id, response, name);

        this.setState({
            ajaxing: false,
            response: ''
        });
    };

    renderTopics() {
        const { topics } = this.props;
        if (topics === null) return null;

        return topics.map(topic => {
            return (
                <Topic
                    title={topic.title}
                    by={topic.nickName}
                    date={topic.timestamp}
                    question={helper.getQuestionName(
                        topic.question,
                        this.props.questions
                    )}
                    content={topic.content}
                    key={topic._id}
                    count={topic.threads.length}
                    clicked={() => this.toggleTopic(topic._id)}
                />
            );
        });
    }

    renderPanel() {
        if (this.state.showing !== null) return null;
        return <div className="Feedback__Topics">{this.renderTopics()}</div>;
    }

    renderContent() {
        const { showing } = this.state;
        if (showing === null) return null;
        const topic = this.props.topics.find(({ _id }) => _id === showing);
        console.log(topic);

        let totalThreads = [];

        totalThreads.push(
            <TimelineItem key={topic._id} index={0} {...topic} />
        );

        const threads = topic.threads.map((thread, index) => {
            return (
                <TimelineItem key={thread._id} {...thread} index={index + 1} />
            );
        });

        totalThreads = totalThreads.concat(threads);

        return (
            <div className="Feedback__Admin__Interface">
                <Button clicked={() => this.setState({ showing: null })}>
                    Back to All Feedbacks
                </Button>
                <h2 className="FAI__Title">{topic.title}</h2>
                <div className="FAI__Description">
                    <span className="FAI__Bold">{topic.nickName}</span> opened
                    this feedback on {parseDate(topic.timestamp)}.
                </div>
                <div className="FAI__Referral">
                    This feedback is referring to
                    <span className="FAI__Referral__Question">
                        {helper.getQuestionName(
                            topic.question,
                            this.props.questions
                        )}
                    </span>
                </div>
                <div className="FAI__Timeline">{totalThreads}</div>
                <div className="FAI__Action">
                    <h3>Reply to this feedback:</h3>
                    <Textarea
                        className="Base__TextArea"
                        onChange={this.handleResponse}
                        value={this.state.response}
                        readOnly={this.state.ajaxing}
                    />
                    <div
                        className={
                            this.state.ajaxing
                                ? 'FAI__Loading'
                                : 'FAI__Loading Hide'
                        }
                    >
                        <img src={LoadingGIF} alt="ajaxing..." />
                        <span>Submitting your response to the server...</span>
                    </div>
                    <Button
                        context="CButton__Green"
                        clicked={() => this.send(topic)}
                        state={this.state.ajaxing}
                    >
                        Submit
                    </Button>
                    <Button
                        context="CButton__Red"
                        clicked={() => this.setState({ response: '' })}
                        state={
                            this.state.response.length === 0 ||
                            this.state.ajaxing
                        }
                    >
                        Clear
                    </Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="Feedbacks">
                {this.renderPanel()}
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        topics: state.feedback.topics,
        questions: state.form.questions,
        loading: state.feedback.loading,
        name: state.auth.name
    };
};

export default connect(mapStateToProps, actions)(Feedbacks);
