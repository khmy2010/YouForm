import React from 'react';

const field = ({ config, children }) => {
    const renderAsterisk = required => {
        let tooltip = null;

        if (required) {
            tooltip = (
                <span
                    className="Text-Required"
                    tooltip="Required"
                    tooltip-position="right"
                >
                    *
                </span>
            );
        }

        return tooltip;
    };

    return (
        <div className="field">
            <h3 className="_label">
                {config.title}
                {renderAsterisk(config.validation.isRequired)}
            </h3>
            <p className="Text-Description">{config.description}</p>
            {children}
        </div>
    );
};

export default field;
