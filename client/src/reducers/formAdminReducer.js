import * as actionTypes from '../actions/types';

const initialState = {
    dataLoaded: false,
    loading: false
};

const formAdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CREATE_NEW_FORM:
            return {
                ...state
            };
        case actionTypes.CREATE_NEW_FORM_START:
            return {
                ...state
            };
        case actionTypes.CREATE_NEW_FORM_FAILED:
            return {
                ...state
            };
        case actionTypes.CREATE_NEW_FORM_SUCCESS:
            return {
                ...state,
                ...action.res.data,
                dataLoaded: true,
                loading: false
            };
        case actionTypes.FETCH_FORM_ADMIN_SUCCESS:
            return {
                ...state,
                ...action.res.data,
                dataLoaded: true,
                loading: false
            };
        default:
            return state;
    }
};

export default formAdminReducer;
