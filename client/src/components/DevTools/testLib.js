import axios from 'axios';

export const beautify = rawData => {
    const stringify = JSON.stringify(rawData);
    return stringify.replace(/,/g, '\n');
};

export const isExist = (qid, questions) => {
    return questions.findIndex(({ _id }) => qid === _id) > -1;
};

export const isBehind = (qid, questions, seq) => {
    const question = questions.find(({ _id }) => qid === _id);
    if (question === undefined) return false;
    return question.sequence > seq;
};

export const deleteOne = async (fid, qid) => {
    return await axios.delete(`/test/${fid}/questions/${qid}`, qid);
};

export const getRand = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};
