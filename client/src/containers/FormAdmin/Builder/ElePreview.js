import React from 'react';

import Field from '../../Fields/Field';

const elePreview = ({
    type,
    title,
    description,
    validation,
    options,
    dateType
}) => (
    <div className="ElePreview">
        <Field
            component={type}
            title={title}
            description={description}
            validation={validation}
            options={options}
            dateType={dateType}
        />
    </div>
);

export default elePreview;
