import React from 'react';

import { parseDate, checkPlural } from '../../../utils';

import './Topic.css';

const topic = ({ title, by, date, question, content, clicked, count }) => {
    return (
        <section className="Feedbacks__Topic" onClick={clicked}>
            <div className="Feedbacks__Feedback">
                <div className="Feedbacks__Topic__Title">{title}</div>
                <div className="Feedbacks__Topic__Posted">
                    <span>Posted by </span>
                    <span className="Feedbacks__Bold">{by}</span>
                    <span> at </span>
                    <span className="Feedbacks__Bold">{parseDate(date)}</span>
                </div>
                <div className="Feedbacks__Topic__Refer">
                    <span>Question: </span>
                    <span className="Feedbacks__Bold Feedbacks__Overflow">
                        {question}
                    </span>
                </div>
                <div className="Feedbacks__Topic__Content">{content}</div>
            </div>
            <div className="Feedback__Responses__Count">
                <p className="Feedback__Responses__Number">{count}</p>
                <p>{checkPlural(count, 'Response')}</p>
            </div>
        </section>
    );
};

export default topic;
