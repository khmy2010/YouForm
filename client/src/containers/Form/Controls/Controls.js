import React from 'react';

import Control from './Control';
import './Controls.css';

const controls = props => {
    return (
        <div className="Form__Controls">
            <Control text="Back" name="Back" clicked={props.onBack} />
            <Control text="In Doubt?" name="Info" />
            <Control text="Next" name="Next" clicked={props.onNext} />
        </div>
    );
};

export default controls;
