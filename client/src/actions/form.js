import axios from 'axios';

import * as actionTypes from './types';

export const createNewForm = (formData, history) => async dispatch => {
    console.log('alo ' + formData);
    try {
        const res = await axios.post('/api/forms/new', formData);
        dispatch({ type: actionTypes.CREATE_NEW_FORM_SUCCESS, res });
        history.push(`/app/edit/${res.data._id}`);
    } catch (error) {
        dispatch({ type: actionTypes.CREATE_NEW_FORM_FAILED, error });
    }
};
