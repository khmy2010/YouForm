import React from 'react';

import { dateDiff } from '../../../utils';
import './TopicContent.css';

const topicContent = ({ content, nickName, timestamp, isOwner }) => {
    let formOwner = null;
    let contentClasses = ['PF__Topic__Thread__Content'];

    if (isOwner) {
        formOwner = (
            <div className="PF__Topic__Thread__Header__ShowOwner">
                &#9733; Form Owner
            </div>
        );

        contentClasses.push('PF__Topic__Thread__Content__IsOwner');
    }

    contentClasses = contentClasses.join(' ');

    let name = nickName;
    if (name.trim().length === 0) name = 'anonymous';

    return (
        <div className="PF__Topic__Thread">
            <div className="PF__Topic__Thread__Header">
                <div className="PF__Topic__Thread__Header__Content">
                    <span className="Bold">{name}</span>{' '}
                    <span>commented on </span>
                    <span className="Bold">{dateDiff(timestamp).text}</span>
                </div>
                {formOwner}
            </div>
            <div className={contentClasses}>{content}</div>
        </div>
    );
};

export default topicContent;
