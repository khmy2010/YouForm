import React from 'react';

import EleComp from '../Builder/EleComp';

//mode and seq will be undefined in CREATING mode
const order = ({ questions, onChange, ori }) => {
    //no need to reorder when there is no question yet / 1 question
    if (questions.length <= 1) return null;

    const copiedQuestions = [...questions];

    const options = copiedQuestions.map((question, index) => {
        return {
            value: index,
            display: `Place after: ${question.title}`
        };
    });

    options.splice(ori - 1, 1);

    //don't need to be first when you're already first.
    if (ori !== 1)
        options.splice(0, 0, { value: -1, display: 'Place at first' });

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
