import React from 'react';

import './Preloading.css';

const Preloading = ({ show }) => {
    if (!show) {
        return null;
    } else {
        return (
            <div className="App-Preloading">
                <div className="Loading-Content">
                    <div className="loader" />
                    <h3 className="Loading-Text">Loading...</h3>
                </div>
            </div>
        );
    }
};

export default Preloading;
