import { FETCH_FORMS } from '../actions/types';

const initialState = {
    forms: null,
    count: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_FORMS:
            const forms = action.forms.data;

            return {
                ...state,
                forms,
                count: state.count + forms.length
            };
        default:
            return state;
    }
}
