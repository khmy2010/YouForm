import React from 'react';

import Field from '../../Fields/Field';

const elePreview = ({ type, title, description, validation }) => (
    <div className="ElePreview">
        <Field
            component={type}
            title={title}
            description={description}
            validation={validation}
        />
    </div>
);

export default elePreview;
