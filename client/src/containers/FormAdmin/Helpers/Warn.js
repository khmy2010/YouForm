import React from 'react';

const warn = ({ show, msg }) => {
    if (!show) return null;

    return <div className="QuestionBuilder__Warn">{msg}</div>;
};

export default warn;
