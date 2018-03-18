import axios from 'axios';

import * as actionTypes from './types';

export const createNewForm = (formData, history) => async dispatch => {
    try {
        const res = await axios.post('/api/forms/new', formData);
        dispatch({ type: actionTypes.CREATE_NEW_FORM_SUCCESS, res });
        history.push(`/app/edit/${res.data._id}`);
    } catch (error) {
        dispatch({ type: actionTypes.CREATE_NEW_FORM_FAILED, error });
    }
};

export const fetchFormAdmin = (fid, history) => async dispatch => {
    try {
        const res = await axios.get(`/api/forms/admin/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_SUCCESS, res });
        history.replace(`/app/edit/${res.data._id}/build`);
    } catch (error) {
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_FAILED, error });
    }
};
