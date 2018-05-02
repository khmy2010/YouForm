import axios from 'axios';

import * as actionTypes from './types';

export const fetchForm = fid => async dispatch => {
    dispatch({ type: actionTypes.FETCH_FORM_START });
    try {
        const res = await axios.get(`/api/forms/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_SUCCESS, res, fid });
    } catch ({ response }) {
        dispatch({ type: actionTypes.FETCH_FORM_FAILED, response });
    }
};

export const syncState = (qid, data) => {
    return { type: actionTypes.SYNC_STATE, qid, data };
};
