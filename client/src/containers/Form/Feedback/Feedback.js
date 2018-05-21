import React, { Component } from 'react';

import axios from 'axios';
import Textarea from 'react-textarea-autosize';

import PFActions from '../../../components/Form/PFActionButtons/PFActions';
import PFNotFound from '../../../components/Form/PFNotFound/PFNotFound';
import TopicTitle from '../../../components/Form/TopicTitle/TopicTitle';
import TopicContent from '../../../components/Form/TopicContent/TopicContent';
import { organisePosts } from '../../../utils';

import './Feedback.css';

class PublicFeedback extends Component {
    state = {
        showNewQuestionInput: false,
        noFeedback: false,
        title: '',
        content: '',
        nickName: '',
        topics: [],
        posts: [],
        showing: null,
        loading: true
    };

    componentDidMount() {
        const { fid, qid } = this.props;
        axios.get(`/api/feedbacks/${fid}/${qid}`).then(res => {
            if (!res.data) {
                this.setState({ noFeedback: true, loading: false });
                return;
            }
            this.setState({
                topics: organisePosts(res.data.posts),
                posts: res.data.posts,
                loading: false
            });
        });
    }

    handleChange = evt => {
        this.setState({ [evt.target.name]: evt.target.value });
    };

    addThread = async () => {
        let nickName = this.state.nickName;

        if (this.state.nickName.trim().length === 0) nickName = 'anonymous';

        const obj = {
            fid: this.props.fid,
            question: this.props.qid,
            parent: this.state.showing ? this.state.showing : '',
            timestamp: Date.now(),
            title: this.state.showing ? '' : this.state.title,
            content: this.state.content,
            nickName: nickName,
            isOwner: false
        };

        const res = await axios.post('/api/feedbacks', obj);
        obj._id = res.data._id;
        const posts = this.state.posts.slice();
        const appendedPosts = posts.concat(obj);

        this.setState(
            {
                topics: organisePosts(appendedPosts),
                posts: appendedPosts,
                showNewQuestionInput: false
            },
            this.resetInput
        );
    };

    toggleFeedbackThread = tid => {
        this.setState({
            showing: tid ? tid : null,
            title: '',
            content: '',
            nickName: '',
            showNewQuestionInput: false
        });
    };

    resetInput = () => {
        this.setState({
            title: '',
            content: '',
            nickName: ''
        });
    };

    back = () => {
        this.toggleFeedbackThread();
    };

    renderInput() {
        const { title, showNewQuestionInput, content } = this.state;
        if (!showNewQuestionInput) return null;

        const submittable =
            title.trim().length > 0 && content.trim().length > 0;

        return (
            <div className="PF__NewPost">
                <Textarea
                    className="Base__TextArea"
                    placeholder="Question title (required)"
                    name="title"
                    onChange={this.handleChange}
                    value={this.state.title}
                />
                <Textarea
                    className="Base__TextArea"
                    placeholder="Ask your question here (required)"
                    name="content"
                    onChange={this.handleChange}
                    minRows={2}
                    value={this.state.content}
                />
                <Textarea
                    className="Base__TextArea"
                    placeholder="Your name (optional)"
                    name="nickName"
                    onChange={this.handleChange}
                    value={this.state.nickName}
                />
                <PFActions
                    cancel={() =>
                        this.setState({ showNewQuestionInput: false })
                    }
                    submittable={submittable}
                    okay={this.addThread}
                />
            </div>
        );
    }

    renderPromo() {
        const { topics, loading } = this.state;
        console.log('topics.length: ', topics.length);
        console.log('loading: ', loading);
        console.log(topics.length !== 0 || loading);
        if (topics.length !== 0 || loading) return null;
        return <PFNotFound />;
    }

    renderTopicsByTitle() {
        if (this.state.showing !== null) return null;

        const { topics } = this.state;
        if (topics.length === 0) return null;

        return topics.map(({ title, threads, _id }, index) => {
            return (
                <TopicTitle
                    key={_id}
                    title={title}
                    count={threads.length}
                    index={index}
                    clicked={() => this.toggleFeedbackThread(_id)}
                />
            );
        });
    }

    renderTopicContent() {
        const { topics, showing } = this.state;
        if (showing === null) return null;

        const topic = topics.find(({ _id }) => _id === showing);

        const starter = [
            <TopicContent
                nickName={topic.nickName}
                timestamp={topic.timestamp}
                content={topic.content}
                key={topic._id}
                isOwner={false}
            />
        ];

        const threads = topic.threads.map(thread => {
            return (
                <TopicContent
                    nickName={thread.nickName}
                    timestamp={thread.timestamp}
                    content={thread.content}
                    key={thread._id}
                    isOwner={thread.isOwner}
                />
            );
        });

        const renderedThreads = starter.concat(threads);

        return (
            <div className="PF__TopicContentWrapper">
                <div className="PF__BackToList" onClick={this.back}>
                    <span className="PF__BackArrow">&#8592;</span>{' '}
                    <span>Back to All Questions</span>
                </div>
                <h2>{topic.title}</h2>
                <div className="PF__TopicContent__Threads">
                    {renderedThreads}
                </div>
                <div className="PF__TopicContent__Reply">
                    <h3>Have any idea to add on? Comment below!</h3>
                    <Textarea
                        className="Base__TextArea"
                        placeholder="Your name (optional)"
                        name="nickName"
                        onChange={this.handleChange}
                        value={this.state.nickName}
                    />
                    <Textarea
                        className="Base__TextArea"
                        placeholder="Add a reply (required)"
                        name="content"
                        onChange={this.handleChange}
                        value={this.state.content}
                        minRows={2}
                    />
                    <PFActions
                        cancelText="Reset"
                        cancel={this.resetInput}
                        submittable={this.state.content.trim().length > 0}
                        okay={this.addThread}
                    />
                </div>
            </div>
        );
    }

    render() {
        const { showNewQuestionInput, showing } = this.state;

        return (
            <div className="PF">
                <div className="PF__Close" onClick={this.props.close}>
                    Close
                </div>
                <div
                    className={
                        showNewQuestionInput || showing ? 'Hide' : 'PF__AskCTA'
                    }
                    onClick={() =>
                        this.setState({ showNewQuestionInput: true })
                    }
                >
                    Ask a new question
                </div>
                {this.renderInput()}
                {this.renderPromo()}
                {this.renderTopicsByTitle()}
                {this.renderTopicContent()}
            </div>
        );
    }
}

export default PublicFeedback;
