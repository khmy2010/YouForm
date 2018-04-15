import React from 'react';

import EleComp from '../Builder/EleComp';

const order = ({ questions, onChange }) => {
    if (questions.length === 0) return null;

    //"after" convention
    const options = questions.map((question, index) => {
        //last question
        if (index === questions.length - 1) {
            return {
                value: 999,
                display: 'Last Question'
            };
        } else {
            return {
                value: index,
                display: `Place after: ${question.title}`
            };
        }
    });

    const handleSelectionChange = (display, index, value) => {
        onChange(value);
    };

    return (
        <EleComp
            type="select"
            name="order"
            displayName="Placement:"
            options={options}
            onChange={handleSelectionChange}
        />
    );
};

export default order;
