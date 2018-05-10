import axios from 'axios';

import * as actionTypes from './types';

export const fetchForm = (fid, store) => async dispatch => {
    dispatch({ type: actionTypes.FETCH_FORM_START });
    try {
        const res = await axios.get(`/api/forms/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_SUCCESS, res, fid });
        dispatch({ type: actionTypes.LOAD_STATE, data: store.get() });
    } catch (error) {
        console.log(error);
        // dispatch({ type: actionTypes.FETCH_FORM_FAILED, response });
    }
};

export const syncState = (qid, data) => {
    return { type: actionTypes.SYNC_STATE, qid, data };
};

export const resume = () => {
    return { type: actionTypes.RESUME_STATE };
};
