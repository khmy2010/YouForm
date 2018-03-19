import * as actionTypes from '../actions/types';

const initialState = {
    fid: null,
    questions: []
};

const formReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_FORM:
            console.log(action);
            return {
                ...state,
                fid: action.res.data._id,
                questions: action.res.data.questions
            };
        case actionTypes.ADD_QUESTION:
            return {
                ...state,
                questions: state.questions.concat(action.question)
            };
        default:
            return state;
    }
};

export default formReducer;
