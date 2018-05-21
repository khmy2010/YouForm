import React from 'react';

import './PFActions.css';

import Button from '../../ContextButton/CButton';

const actions = ({ cancel, okay, submittable, cancelText }) => {
    return (
        <div className="PF__ActionButtons">
            <Button context="CButton__Red" clicked={cancel}>
                {cancelText ? cancelText : 'Cancel'}
            </Button>
            <Button clicked={okay} state={!submittable}>
                Post
            </Button>
        </div>
    );
};

export default actions;
