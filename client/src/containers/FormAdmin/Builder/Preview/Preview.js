import React from 'react';

import PreviewEditor from './PreviewEditor';
import Field from '../../../Fields/Field';

const preview = ({ questions, onEdit, onDelete }) => {
    let transformedQuestions = null;

    if (questions.length !== 0) {
        transformedQuestions = questions.map((question, index) => {
            let parsedValidation = {};

            if (question.validation) {
                parsedValidation = JSON.parse(question.validation);
            }

            return (
                <PreviewEditor
                    key={index}
                    onEditQuestion={() => onEdit(question)}
                    onDeleteQuestion={() => onDelete(question)}
                >
                    <Field
                        component={question.type}
                        title={question.title}
                        description={question.description}
                        validation={parsedValidation}
                        options={question.options}
                        dateType={question.dateType}
                    />
                </PreviewEditor>
            );
        });
    }

    return <div className="Builder__Preview">{transformedQuestions}</div>;
};

export default preview;
