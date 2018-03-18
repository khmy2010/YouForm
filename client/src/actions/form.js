import axios from 'axios';

import * as actionTypes from './types';

export const fetchFormAdmin = (fid, history) => async dispatch => {
    try {
        const res = await axios.get(`/api/forms/admin/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_SUCCESS, res });
        history.replace(`/app/admin/${res.data._id}/build`);
    } catch (error) {
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_FAILED, error });
    }
};
