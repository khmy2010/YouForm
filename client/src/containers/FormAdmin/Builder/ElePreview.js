import React from 'react';

import Field from '../../Fields/Field';

const elePreview = ({ type, title, description, validation, options }) => (
    <div className="ElePreview">
        <Field
            component={type}
            title={title}
            description={description}
            validation={validation}
            options={options}
        />
    </div>
);

export default elePreview;
