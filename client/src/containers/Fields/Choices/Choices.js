import React from 'react';

import './Choices.css';
import Choice from './Choice';

//possible props:
//array of choices
//min, max
//
const choices = ({ options, selectedKeys, clicked }) => {
    if (options && options.length === 0) {
        return null;
    }

    const renderedChoices = options.map((choice, index) => {
        if (choice.trim().length !== 0) {
            let selected = false;

            if (selectedKeys.find(ele => ele === index) !== undefined) {
                selected = true;
            }

            return (
                <Choice
                    key={index}
                    text={choice}
                    selected={selected}
                    clicked={() => clicked(index)}
                />
            );
        } else {
            return null;
        }
    });

    return <div className="Choices">{renderedChoices}</div>;
};

export default choices;
