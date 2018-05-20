import React from 'react';

import Button from './Button';

import './Controls.css';

/*
    This component is supposed to be dumb, 
    i.e. tell me what to render then i render
    Possible Props:
    1. Can I go back?
    2. Can I go forward?
    3. How many Q&A is already there?
    4. Is this the first question (then the button text look different)
    5. Is this the last question (then the button text look different)
    6. Did I submitted the form? (then it will be a thanks?)
*/
const controls = props => {
    const buttons = [];

    if (props.back)
        buttons.push(
            <Button key="Back" text="Previous" clicked={props.navPrev} />
        );

    buttons.push(
        <Button
            key="Feedback"
            text="In Doubt?"
            clicked={props.showFeedback}
            classes="Form__Controls__QA"
        />
    );

    if (props.next) {
        const { isQuestion, nextable, isSubmitNext, submittable } = props.next;
        let text;
        let classes = null;

        if (isQuestion) text = 'Next';
        if (isSubmitNext) {
            text = 'Submit';
            classes = 'Form__Controls__Submittable';
        }

        let state = false;

        if (isQuestion && nextable) state = true;
        if (!isQuestion && submittable) state = true;

        buttons.push(
            <Button
                key={text}
                text={text}
                clicked={props.navNext}
                state={state}
                classes={classes}
            />
        );
    }

    return buttons;
};

export default controls;
