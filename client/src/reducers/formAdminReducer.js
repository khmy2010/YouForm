import * as actionTypes from '../actions/types';

const initialState = {
    dataLoaded: false,
    loading: false
};

const formAdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FORM_ADMIN_SUCCESS:
            return {
                ...state,
                ...action.res.data,
                dataLoaded: true,
                loading: false
            };
        case actionTypes.MODIFY_FORM_PROPERTIES:
            return {
                ...state,
                ...action.props
            };
        default:
            return state;
    }
};

export default formAdminReducer;
