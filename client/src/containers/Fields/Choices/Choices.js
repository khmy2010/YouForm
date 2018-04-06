import React from 'react';

import './Choices.css';
import Choice from './Choice';

//possible props:
//array of choices
//min, max
//
const choices = ({ options, selectedKeys, clicked, min, max, err }) => {
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

    const renderChoicesHelper = () => {
        let helperText = null;

        if (!min && !max) helperText = `Choose as many as you like.`;

        if (min) {
            helperText =
                'You will need to choose at least ' + min + ' from the list.';
        }

        if (max) {
            helperText = `Choose as many as ${max} from the list.`;
        }

        if (min && max) {
            if (min === max) {
                helperText = `Choose ${min} options from the list.`;
            } else {
                helperText = `Choose between ${min} to ${max} options from the list.`;
            }
        }

        if (err) {
            helperText = null;
        }
        return <p className="Choices__Helper">{helperText}</p>;
    };

    return (
        <div className="Choices">
            {renderedChoices}
            {renderChoicesHelper()}
        </div>
    );
};

export default choices;
