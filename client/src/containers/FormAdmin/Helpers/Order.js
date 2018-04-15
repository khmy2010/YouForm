import React from 'react';

import EleComp from '../Builder/EleComp';

//mode and seq will be undefined in CREATING mode
const order = ({ questions, onChange, mode, seq }) => {
    //no need to reorder when there is no question yet / 1 question
    if (questions.length <= 1) return null;

    let filtered;

    if (mode !== 'EDITING') filtered = questions;
    else if (mode === 'EDITING' && seq) {
        filtered = questions.filter((question, index) => {
            return index !== seq - 1;
        });
    }

    const options = filtered.map((question, index) => {
        return {
            value: index,
            display: `Place after: ${question.title}`
        };
    });

    const firstOption = { value: -1, display: 'Place at first' };
    options.splice(0, 0, firstOption);

    const handleSelectionChange = (display, index, value) => {
        onChange(value);
    };

    return (
        <EleComp
            type="select"
            name="order"
            displayName="Reorder placement:"
            options={options}
            onChange={handleSelectionChange}
        />
    );
};

export default order;
