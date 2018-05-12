import React from 'react';

import './Item.css';

const item = ({ clicked, dbclicked, name, active }) => {
    let classes = ['Dashboard__Item'];

    if (active) classes.push('Item__Active');
    classes = classes.join(' ');

    return (
        <div className={classes} onClick={clicked} onDoubleClick={dbclicked}>
            {name}
        </div>
    );
};

export default item;
