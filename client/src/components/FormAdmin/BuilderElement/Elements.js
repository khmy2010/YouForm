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
        type: CONSTS.TYPE.LONG_TEXT,
        display: 'Long Text',
        className: 'Element__LongText'
    },
    {
        type: CONSTS.TYPE.EMAIL,
        display: 'Email',
        className: 'Element__Email'
    },
    {
        type: CONSTS.TYPE.LINK,
        display: 'Link',
        className: 'Element__Link'
    },
    {
        type: CONSTS.TYPE.SINGLE_CHOICE,
        display: 'Single Choice',
        className: 'Element__SC'
    },
    {
        type: CONSTS.TYPE.MULTIPLE_CHOICE,
        display: 'Multiple Choice',
        className: 'Element__MC'
    },
    {
        type: CONSTS.TYPE.YES_NO,
        display: 'Yes / No',
        className: 'Element__YN'
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
    },
    {
        type: CONSTS.TYPE.DATE,
        display: 'Date',
        className: 'Element__Date'
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
            <Button className="Elements__Stencils">Import from Stencils</Button>
            <Button className="Element__Context">
                Form Welcome / Thank Screen
            </Button>
            {props.children}
        </div>
    );
};

export default elements;
