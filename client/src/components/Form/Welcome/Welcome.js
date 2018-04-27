import React from 'react';

/*
    Expecting welcome context props that contains:
    1. _id
    2. type
    3. buttonText
    4. description
    5. promoteSharing
    6. title

    and also, a show property (show this or not should be decided by Form)
*/

const welcome = props => {
    if (props.show > 0) return null;
    return (
        <div className="Form__Welcome">
            <h1>{props.name}</h1>
            <p>{props.context.description}</p>
            <button>{props.context.buttonText}</button>
        </div>
    );
};

export default welcome;
