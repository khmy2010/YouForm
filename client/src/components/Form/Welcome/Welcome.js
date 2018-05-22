import React from 'react';

import './Welcome.css';
import Button from '../../ContextButton/CButton';

const welcome = ({ show, context, name, length, clicked }) => {
    if (show > 0) return null;

    //read context
    let welcomeContext = null;

    if (context)
        welcomeContext = context.find(({ type }) => type === 'Welcome');

    let description =
        "The form owner did not provide any description. Why don't you try and experience it by your own?";

    if (welcomeContext && welcomeContext.description)
        description = welcomeContext.description;

    let buttonText = 'Next';

    if (welcomeContext && welcomeContext.buttonText.trim().length > 0)
        buttonText = welcomeContext.buttonText;

    return (
        <div className="Form__Welcome">
            <h1>{name}</h1>
            <p className="Form__Welcome__Description">{description}</p>
            <div className="Form__Instructions">
                <p>This form consists of {length} questions.</p>
                <p className="Form__Instructions__AutoSave">
                    You may leave halfway and continue right back in because
                    your progress will be saved locally.
                </p>
            </div>
            <Button clicked={clicked}>{buttonText}</Button>
        </div>
    );
};

export default welcome;
