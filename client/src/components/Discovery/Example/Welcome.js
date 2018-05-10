import React from 'react';

import InfoSVG from '../../../assets/images/info.svg';

const welcome = ({ context }) => {
    if (
        !context ||
        context.length === 0 ||
        context[0].type !== 'Welcome' ||
        !context[0].description
    ) {
        return (
            <div className="Example__Form__Placeholder">
                <img src={InfoSVG} alt="Not Yet" />
                <p>The owner has not set any welcome message yet.</p>
            </div>
        );
    }

    return (
        <div className="Example__Form__Welcome">{context[0].description}</div>
    );
};

export default welcome;
