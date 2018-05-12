import axios from 'axios';

import * as actionTypes from './types';

export const fetchForms = loaded => async dispatch => {
    try {
        const forms = await axios.get(`/api/forms`);
        dispatch({ type: actionTypes.FETCH_FORMS_SUCCESS, forms });
    } catch (error) {
        console.log(error);
    }
};
