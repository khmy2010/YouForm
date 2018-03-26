import React from 'react';

import Button from '../../Button/Button';
import { CONSTS } from '../../../utils';

import './Elements.css';

const ELEMENTS = [
    {
        type: CONSTS.TYPE.SHORT_TEXT,
        display: 'Short Text',
        className: 'Element__ShortText'
    },
    {
        type: CONSTS.TYPE.EMAIL,
        display: 'Email',
        className: 'Element__Email'
    },
    {
        type: CONSTS.TYPE.NUMBER,
        display: 'Number',
        className: 'Element__Number'
    },
    {
        type: CONSTS.TYPE.CURRENCY,
        display: 'Currency',
        className: 'Element__Currency'
    }
];

const elements = props => {
    const renderedElements = ELEMENTS.map(element => {
        const type = element.type;
        return (
            <Button key={element.type} clicked={() => props.onEleClicked(type)}>
                {element.display}
            </Button>
        );
    });

    return (
        <div className="Builder__Elements">
            {renderedElements}
            {props.children}
        </div>
    );
};

export default elements;
