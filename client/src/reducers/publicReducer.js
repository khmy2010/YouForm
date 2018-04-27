import * as actionTypes from '../actions/types';

const initialState = {
    questions: [],
    loading: null,
    error: false,
    errorMsg: null,
    context: null,
    name: null
};

const publicReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FORM_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.FETCH_FORM_SUCCESS:
            return {
                ...state,
                loading: false,
                name: action.res.data.name,
                questions: action.res.data.questions,
                context: action.res.data.context
            };
        case actionTypes.FETCH_FORM_FAILED:
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: action.response
            };
        default:
            return { ...state };
    }
};

export default publicReducer;
