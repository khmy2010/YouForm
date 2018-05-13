import React from 'react';

import './Details.css';
import { parseDate } from '../../../utils';

import Row from './Row';
import FileSVG from '../../../assets/images/file.svg';

const details = props => {
    const renderModified = () => {
        if (props.updated === undefined) return null;
        return <Row identifier="Modified" data={parseDate(props.updated)} />;
    };

    const renderLatest = () => {
        if (props.latest === undefined) return null;
        return (
            <Row identifier="Latest Response" data={parseDate(props.latest)} />
        );
    };

    return (
        <React.Fragment>
            <div className="Dashboard__Title">
                <img src={FileSVG} alt="file" />
                <span>{props.name}</span>
            </div>
            <div className="Details__Description">
                <Row identifier="Questions" data={props.questionsCount} />
                <Row identifier="Responses" data={props.responsesCount} />
                {renderModified()}
                {renderLatest()}
            </div>
        </React.Fragment>
    );
};

export default details;
