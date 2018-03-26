import React from 'react';
import { connect } from 'react-redux';

import Field from '../../Fields/Field';

const preview = ({ questions }) => {
    let transformedQuestions = null;

    if (questions.length !== 0) {
        transformedQuestions = questions.map((question, index) => {
            let parsedValidation = {};

            if (question.validation) {
                parsedValidation = JSON.parse(question.validation);
            }

            return (
                <Field
                    key={index}
                    component={question.type}
                    title={question.title}
                    description={question.description}
                    validation={parsedValidation}
                />
            );
        });
    }

    return <div className="Builder__Preview">{transformedQuestions}</div>;
};

const mapStateToProps = ({ form }) => {
    return {
        questions: form.questions
    };
};

export default connect(mapStateToProps)(preview);
