import React from 'react';
import tick from '../../../assets/images/tick.svg';

import './Choices.css';

//possible props:

const choice = ({ text, selected, clicked }) => {
    let styles = ['Choice'];
    let tickImage = null;

    if (selected) {
        styles.push('Selected');
        tickImage = <img src={tick} alt="tick" />;
    }

    styles = styles.join(' ');

    return (
        <div className={styles} onClick={clicked}>
            {text}
            {tickImage}
        </div>
    );
};

export default choice;
