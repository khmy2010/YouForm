import * as actionTypes from '../actions/types';

const initialState = {
    fid: null,
    questions: []
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_FORM:
            return {
                ...state,
                fid: action.res.data._id,
                questions: action.res.data.questions
            };
        case actionTypes.ADD_QUESTION:
            action.question._id = action.res.data._id;
            return {
                ...state,
                questions: state.questions.concat(action.question)
            };
        case actionTypes.DELETE_QUESTION:
            const updatedQuestions = state.questions.filter(question => {
                return question._id !== action.qid;
            });
            return {
                ...state,
                questions: updatedQuestions
            };
        default:
            return state;
    }
};

export default formReducer;
