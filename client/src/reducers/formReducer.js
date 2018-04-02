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
            console.log(action.question);
            console.log(action.res);
            action.question._id = action.res.data._id;
            return {
                ...state,
                questions: state.questions.concat(action.question)
            };
        default:
            return state;
    }
};

export default formReducer;
