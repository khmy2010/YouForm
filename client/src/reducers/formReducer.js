import * as actionTypes from '../actions/types';

import { redoSequence, deleteSequence, updateConnected } from '../utils';

const initialState = {
    fid: null,
    name: null,
    questions: [],
    context: null,
    error: false,
    loading: true,
    errorMsg: null
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_FORM:
            return {
                ...state,
                loading: false,
                fid: action.res.data._id,
                name: action.res.data.name,
                questions: action.res.data.questions,
                context: action.res.data.context
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
        case actionTypes.UPDATE_CONTEXT:
            const index = state.context.findIndex(context => {
                return context.type === action.context.type;
            });

            const updatedContext = state.context.slice(0);
            updatedContext[index] = action.context;
            updatedContext[index]._id = state.context[index]._id;

            return {
                ...state,
                context: updatedContext
            };
        case actionTypes.UPDATE_SEQUENCE:
            return {
                ...state,
                questions: redoSequence(
                    state.questions,
                    action.sequence,
                    action.ori
                )
            };
        case actionTypes.DELETE_SEQUENCE:
            return {
                ...state,
                questions: deleteSequence(state.questions).updated
            };
        case actionTypes.UPDATE_LOGIC:
            return {
                ...state,
                questions: updateConnected(state.questions, action.qid).updated
            };
        default:
            return state;
    }
};

export default formReducer;
