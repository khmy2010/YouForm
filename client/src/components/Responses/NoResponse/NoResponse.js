import React from 'react';

import Icon from '../../../assets/images/if.svg';
import './NoResponse.css';

const noResponse = props => {
    return (
        <div className="RField__NoResponse">
            <img src={Icon} alt="Nobody answered this question yet" />
            <div className="RField__NoResponse__Message">
                <h4>Nobody answered this question yet.</h4>
                <p>
                    Don't worry! <span>Share</span> your form to everyone you
                    know or make this a <span>required</span> question.
                </p>
            </div>
        </div>
    );
};

export default noResponse;
