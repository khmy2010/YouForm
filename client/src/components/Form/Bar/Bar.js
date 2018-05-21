import React from 'react';

import './Bar.css';

const bar = ({ current, questions }) => {
    if (!Array.isArray(questions) || questions.length === 0) return null;
    if (current === 0) return null;

    let frags = [];
    let frs = [];

    for (var x = 1; x <= questions.length; x++) {
        let classes = ['Form__Progress'];
        if (x <= current) classes.push('Form__Progress__Made');
        classes = classes.join(' ');

        frags.push(<div className={classes} key={x} />);
        frs.push('1fr');
    }

    frs = frs.join(' ');

    const style = {
        display: 'grid',
        gridTemplateColumns: frs
    };

    let progressClasses = ['Form__ProgressBar'];
    if (current === questions.length)
        progressClasses.push('Form__ProgressBar__Last');

    progressClasses = progressClasses.join(' ');

    return (
        <div className={progressClasses} style={style}>
            {frags}
        </div>
    );
};

export default bar;
