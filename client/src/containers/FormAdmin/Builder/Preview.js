import React from 'react';
import { connect } from 'react-redux';

import Field from '../../Fields/Field';

const preview = ({ questions }) => {
    if (questions.length === 0) {
        return null;
    }

    const transformedQuestions = questions.map(question => {
        let parsedValidation = {};

        if (question.validation) {
            parsedValidation = JSON.parse(question.validation);
        }

        return (
            <Field
                component={question.type}
                title={question.title}
                description={question.description}
                validation={question.validation}
            />
        );
    });

    return <div />;
};

const mapStateToProps = ({ form }) => {
    return {
        questions: form.questions
    };
};

export default connect(mapStateToProps)(preview);
