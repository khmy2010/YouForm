import React from 'react';

import { checkPlural } from '../../../utils';
import './TopicTitle.css';

const topicTitle = ({ title, count, index, clicked }) => {
    return (
        <div
            className={
                index === 0
                    ? 'PF__TopicTitle PF__TopicTitleFirst'
                    : 'PF__TopicTitle'
            }
            onClick={clicked}
        >
            <div className="PFT__QuestionTitle">{title}</div>
            <div className="PFT__Count">
                <div className="PFT__Figure">{count}</div>
                <div className="PFT__ResponseCount">
                    {checkPlural(count, 'Response')}
                </div>
            </div>
        </div>
    );
};

export default topicTitle;
