import React from 'react';

const details = props => {
    return (
        <React.Fragment>
            <div className="Details__Description">
                <div className="Details__Row">
                    <span>Questions: </span>
                    <span>{props.questionsCount}</span>
                </div>
                <div className="Details__Row">
                    <span>Responses: </span>
                    <span>{props.responsesCount}</span>
                </div>
            </div>
        </React.Fragment>
    );
};

export default details;
