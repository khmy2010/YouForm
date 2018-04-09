import React from 'react';

import Field from '../../Fields/Field';

const elePreview = props => {
    return (
        <div className="ElePreview">
            <Field component={props.type} {...props} />
        </div>
    );
};

export default elePreview;
