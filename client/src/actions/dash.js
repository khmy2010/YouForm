import axios from 'axios';

import * as actionTypes from './types';

export const fetchForms = loaded => async dispatch => {
    console.log(loaded);
    try {
        const forms = await axios.get(`/api/forms?skipCount=${loaded}`);
        dispatch({ type: actionTypes.FETCH_FORMS, forms });
    } catch (error) {
        console.log(error);
    }
};
