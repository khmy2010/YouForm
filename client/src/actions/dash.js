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

export const deleteForm = fid => async dispatch => {
    try {
        dispatch({ type: actionTypes.DELETE_FORM_START });
        await axios.delete(`/api/forms/${fid}`);
        dispatch({ type: actionTypes.DELETE_FORM_SUCCESS, fid });
    } catch (error) {
        console.log(error);
        dispatch({ type: actionTypes.DELETE_FORM_FAILED });
    }
};

export const renameForm = (fid, newName) => async dispatch => {
    try {
        dispatch({ type: actionTypes.RENAME_FORM_START });
        await axios.patch(`/api/forms/${fid}`, { name: newName });
        dispatch({ type: actionTypes.RENAME_FORM_SUCCESS, fid, newName });
    } catch (error) {
        dispatch({ type: actionTypes.RENAME_FORM_FAILED });
        console.log(error);
    }
};
