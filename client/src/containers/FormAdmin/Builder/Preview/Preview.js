import React from 'react';

import PreviewEditor from './PreviewEditor';
import Field from '../../../Fields/Field';

const preview = ({ questions, onEdit, onDelete, onSaveStencil }) => {
    let transformedQuestions = null;

    if (questions.length !== 0) {
        transformedQuestions = questions.map((question, index) => {
            let parsedValidation = {};
            let parsedOptions = {};

            if (question.validation) {
                parsedValidation = JSON.parse(question.validation);
            }

            if (question.options) {
                parsedOptions = JSON.parse(question.options);
            }

            return (
                <PreviewEditor
                    key={index}
                    onEditQuestion={() => onEdit(question)}
                    onDeleteQuestion={() => onDelete(question)}
                    onSaveStencil={() => onSaveStencil(question)}
                >
                    <Field
                        component={question.type}
                        title={question.title}
                        description={question.description}
                        validation={parsedValidation}
                        options={parsedOptions}
                        dateType={question.dateType}
                    />
                </PreviewEditor>
            );
        });
    }

    return <div className="Builder__Preview">{transformedQuestions}</div>;
};

export default preview;
