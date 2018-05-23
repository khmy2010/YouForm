import React from 'react';

import './Timeline.css';

import { dateDiff } from '../../../utils';

const timeline = props => {
    let authorClasses = ['FAI__Author__Status'];
    let authorText = '';

    if (props.index === 0) authorText = 'Issue Thread';
    else if (props.index > 0 && !props.isOwner) {
        authorClasses.push('FAI__Author__Comment');
        authorText = 'Commentator';
    } else {
        authorClasses.push('FAI__Author__Owner');
        authorText = 'Form Owner';
    }

    authorClasses = authorClasses.join(' ');

    return (
        <div className="FAI__Timeline__History">
            <div className="FAI__Timeline__Header">
                <div className="FAI__Timeline__Author">
                    <span className="FAI__Bold">{props.nickName}</span>{' '}
                    commented {dateDiff(props.timestamp).text}
                </div>
                <div className="FAI__Timeline__Info">
                    <div className={authorClasses}>{authorText}</div>
                    {/* <span
                        className="FAI__Timeline__Bin"
                        onClick={() => props.delete()}
                    /> */}
                </div>
            </div>
            <div className="FAI__Timeline__Body">{props.content}</div>
        </div>
    );
};

export default timeline;
