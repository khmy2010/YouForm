import React from 'react';

import './Choices.css';
import { typeCheck } from '../../../utils';
import Choice from './Choice';

const choices = ({ type, options, keys, clicked, err, min, max }) => {
    if (options && options.length === 0) {
        return null;
    }

    const renderedChoices = options.map((choice, index) => {
        if (choice.trim().length !== 0) {
            let selected = false;

            if (keys.find(ele => ele === index) !== undefined) {
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

        if (typeCheck.isAloneChoice(type)) {
            helperText = 'Choose one from the list.';
        }

        if (err || (options.length === 1 && options[0].trim().length === 0)) {
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
