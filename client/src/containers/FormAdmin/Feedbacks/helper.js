export const getQuestionName = (qid, questions) => {
    if (Array.isArray(questions) === false) return null;
    const question = questions.find(({ _id }) => _id === qid);

    return question ? question.title : null;
};
