import { FETCH_FORMS_SUCCESS } from '../actions/types';

const initialState = {
    forms: null,
    loading: true
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_FORMS_SUCCESS:
            const forms = action.forms.data;
            return {
                ...state,
                forms,
                loading: false
            };
        default:
            return state;
    }
}
