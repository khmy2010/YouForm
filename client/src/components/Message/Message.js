import React from 'react';

import './Message.css';
import LoadingGIF from '../../assets/images/loading.gif';

const message = ({ show }) => {
    if (!show) return null;

    return (
        <div className="Message">
            <img src={LoadingGIF} alt="Loading" />
            <span>Loading...</span>
        </div>
    );
};

export default message;
