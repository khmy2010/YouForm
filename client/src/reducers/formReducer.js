import * as actionTypes from '../actions/types';

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
            const fetchedQuestions = action.res.data.questions;
            const sortedQuestions = fetchedQuestions.sort(
                (a, b) => a.sequence - b.sequence
            );

            return {
                ...state,
                loading: false,
                fid: action.res.data._id,
                name: action.res.data.name,
                questions: sortedQuestions,
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
            const sequence = action.sequence;

            //find affected questions that have later sequence
            const affectedIndex = state.questions.findIndex(question => {
                return question.sequence >= sequence;
            });

            const updated = state.questions.map((question, index) => {
                if (
                    index >= affectedIndex &&
                    index !== state.questions.length - 1
                )
                    question.sequence += 1;
                return question;
            });

            const sorted = updated.sort((a, b) => a.sequence - b.sequence);

            return {
                ...state,
                questions: sorted
            };
        default:
            return state;
    }
};

export default formReducer;
