import React from 'react';

import Select from '../../../components/Select/Select';

import './Helper.css';

/* 
    Possible Properties:
    1. seq
    2. options
    3. questions
*/

const transformOptions = arr =>
    arr.map((ele, index) => {
        return {
            value: index,
            display: ele
        };
    });

const transformQuestions = questions =>
    questions.map(({ title, sequence, _id }) => {
        return {
            value: _id,
            display: `${sequence}: ${title}`
        };
    });

const mapIDToQuestion = (questions, qid) => {
    console.log(questions);
    console.log(qid);
    const { title, sequence } = questions.find(({ _id }) => _id === qid);
    return `${sequence}: ${title}`;
};

const logicField = props => {
    let button = null;

    //creating new logic
    if (props.save) {
        button = (
            <div className="Logic__Buttons">
                <button disabled={!props.save} onClick={props.onSave}>
                    Save
                </button>
            </div>
        );
    }

    return (
        <div className="Logic">
            <div className="Logic__Label">
                <label>Logic {props.seq + 1}: </label>
                <span onClick={() => props.remove(props.index)}>
                    <svg
                        id="Logic__Remove"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        {/* <path d="M0 0h24v24H0z" fill="none" /> */}
                    </svg>
                </span>
            </div>
            <div className="Logic__Panel">
                <span>IF</span>
                <Select
                    options={transformOptions(props.options)}
                    clicked={props.onOptionChange}
                    dynamic
                    init={
                        props.selectedOption === undefined
                            ? null
                            : props.selectedOption
                    }
                />
            </div>
            <div className="Logic__Panel">
                <span>THEN</span>
                <Select
                    options={transformQuestions(props.questions)}
                    clicked={props.onQuestionChange}
                    dynamic
                    init={
                        props.qid
                            ? mapIDToQuestion(props.questions, props.qid)
                            : null
                    }
                />
            </div>
            {button}
        </div>
    );
};

export default logicField;
