import React, { Component } from 'react';

import axios from 'axios';
import Textarea from 'react-textarea-autosize';

import Button from '../../../components/ContextButton/CButton';
import handSVG from '../../../assets/images/hand.svg';
import './Feedback.css';

class PublicFeedback extends Component {
    state = {
        showNewQuestionInput: false
    };

    componentDidMount() {
        const { fid, qid } = this.props;
        axios.get(`/api/feedbacks/${fid}/${qid}`);
    }

    renderInput() {
        if (!this.state.showNewQuestionInput) return null;

        return (
            <div className="PF__NewPost">
                <Textarea
                    className="Base__TextArea"
                    placeholder="Ask your question here"
                />
                <div className="PF__ActionButtons">
                    <Button>Cancel</Button>
                    <Button>Post</Button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="PF">
                <div className="PF__Close" onClick={this.props.close}>
                    Close
                </div>
                <div
                    className={
                        this.state.showNewQuestionInput ? 'Hide' : 'PF__AskCTA'
                    }
                    onClick={() =>
                        this.setState({ showNewQuestionInput: true })
                    }
                >
                    Ask a new question
                </div>
                {this.renderInput()}
                <div className="PF__Content">Blah</div>
                <div className="PF__NotFound">
                    <h2>Nobody asked questions yet</h2>
                    <p className="PF__NotFoundDesc">
                        Be the first to ask your question!
                    </p>
                    <img src={handSVG} alt="Hand" />
                </div>
            </div>
        );
    }
}

export default PublicFeedback;
