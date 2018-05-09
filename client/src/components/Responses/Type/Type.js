import React from 'react';

import './Type.css';

import { CONSTS } from '../../../utils';

const type = ({ type }) => {
    let typeIdentifier = null;
    let color = { backgroundColor: '#000' };

    const setBG = hex => {
        color.backgroundColor = hex;
    };

    const setType = type => {
        typeIdentifier = type;
    };

    switch (type) {
        case CONSTS.TYPE.CURRENCY:
            setType('Currency');
            setBG('#f5af02');
            break;
        case CONSTS.TYPE.DATE:
            setType('Date');
            setBG('#314855');
            break;
        case CONSTS.TYPE.EMAIL:
            setType('Email');
            setBG('#2facb2');
            break;
        case CONSTS.TYPE.LINK:
            setType('Link');
            setBG('#00539f');
            break;
        case CONSTS.TYPE.LONG_TEXT:
            setType('Long Text');
            setBG('#f67c1a');
            break;
        case CONSTS.TYPE.MULTIPLE_CHOICE:
            setType('Multiple Choice');
            setBG('#3369e7');
            break;
        case CONSTS.TYPE.NUMBER:
            setType('Number');
            setBG('#4d9db3');
            break;
        case CONSTS.TYPE.SHORT_TEXT:
            setType('Short Text');
            setBG('#8e43e7');
            break;
        case CONSTS.TYPE.SINGLE_CHOICE:
            setType('Single Choice');
            setBG('#0077b5');
            break;
        case CONSTS.TYPE.YES_NO:
            setType('Yes / No');
            setBG('#d25238');
            break;
        case CONSTS.TYPE.DROPDOWN:
            setType('Drop Down');
            setBG('#425563');
            break;
        default:
            setType('Question');
            setBG('#232121');
            break;
    }

    console.log(color);

    return (
        <span style={color} className="RField__Type">
            {typeIdentifier}
        </span>
    );
};

export default type;
