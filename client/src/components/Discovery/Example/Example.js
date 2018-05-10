import React from 'react';

import Welcome from './Welcome';

import './Example.css';

const example = props => {
    const { fid, length, name, owner, context } = props.form;
    return (
        <section className="Example__Form">
            <div className="Example__Form__Name">{name}</div>
            <div className="Example__Form__Info">
                <p>
                    Owned by: <span>{owner}</span>
                </p>
                <p>
                    <span>{length}</span>{' '}
                    {length <= 1 ? 'question' : 'questions'}
                </p>
            </div>
            <Welcome context={context} />
            <div className="Example__Form__CTA">
                <button onClick={() => props.history.push(`/forms/${fid}`)}>
                    Open Form
                </button>
            </div>
        </section>
    );
};

export default example;
