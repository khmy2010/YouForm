import * as actionTypes from '../actions/types';

const initialState = {
    fid: null,
    name: null,
    questions: [],
    error: false,
    loading: true,
    errorMsg: null
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_FORM:
            console.log(action.res.data);
            return {
                ...state,
                loading: false,
                fid: action.res.data._id,
                name: action.res.data.name,
                questions: action.res.data.questions
            };
        case actionTypes.ADD_QUESTION:
            action.question._id = action.res.data._id;
            return {
                ...state,
                questions: state.questions.concat(action.question)
            };
        case actionTypes.EDIT_QUESTION:
            const oldIndex = state.questions.findIndex(question => {
                return question._id === action.qid;
            });

            const newQuestions = state.questions.slice();
            newQuestions[oldIndex] = action.question;

            return {
                ...state,
                questions: newQuestions
            };
        case actionTypes.DELETE_QUESTION:
            const updatedQuestions = state.questions.filter(question => {
                return question._id !== action.qid;
            });
            return {
                ...state,
                questions: updatedQuestions
            };
        case actionTypes.FETCH_FORM_FAILED:
            return {
                ...state,
                error: true,
                loading: false,
                errorMsg: action.response
            };
        default:
            return state;
    }
};

export default formReducer;
