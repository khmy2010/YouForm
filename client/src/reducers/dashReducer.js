import * as actionsTypes from '../actions/types';

const initialState = {
    forms: null,
    loading: true,
    operating: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case actionsTypes.FETCH_FORMS_SUCCESS:
            const forms = action.forms.data;
            return {
                ...state,
                forms,
                loading: false
            };
        case actionsTypes.DELETE_FORM_START:
            return { ...state, operating: true };
        case actionsTypes.DELETE_FORM_SUCCESS:
            const updated = state.forms.filter(({ _id }) => _id !== action.fid);
            return {
                ...state,
                operating: false,
                forms: updated
            };
        case actionsTypes.DELETE_FORM_FAILED:
            return { ...state, operating: false };
        case actionsTypes.RENAME_FORM_START:
            return { ...state, operating: true };
        case actionsTypes.RENAME_FORM_SUCCESS:
            const copied = state.forms.map(form => {
                if (form._id === action.fid) form.name = action.newName;

                return form;
            });
            console.log(copied);
            return { ...state, forms: state.forms, operating: false };
        case actionsTypes.RENAME_FORM_FAILED:
            return { ...state, operating: false };
        default:
            return state;
    }
}
