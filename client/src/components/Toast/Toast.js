import React from 'react';

const toast = ({ show, message }) => {
    let className = '';

    if (show) {
        className = 'Toast__Show';
    }
    return (
        <div id="toast" className={className}>
            {message}
        </div>
    );
};

export default toast;
