import axios from 'axios';

import * as actionTypes from './types';

export const fetchFormAdmin = (fid, history) => async dispatch => {
    try {
        const res = await axios.get(`/api/forms/admin/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_SUCCESS, res });
        dispatch({ type: actionTypes.INIT_FORM, res });
        history.replace(`/app/admin/${res.data._id}/build`);
    } catch (error) {
        console.error(error);
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_FAILED, error });
    }
};

export const addQuestion = (question, fid) => async dispatch => {
    try {
        const res = await axios.post(`/api/forms/${fid}/questions`, question);
        dispatch({ type: actionTypes.ADD_QUESTION, question, res });
    } catch (error) {}
};

export const deleteQuestion = (fid, qid) => async dispatch => {
    console.log(fid, qid);
    try {
        await axios.delete(`/api/forms/${fid}/questions/${qid}`);
        dispatch({ type: actionTypes.DELETE_QUESTION, qid });
    } catch (error) {}
};

export const changeFormProperties = (fid, props) => async dispatch => {
    try {
        await axios.patch(`/api/forms/${fid}`, props);
        dispatch({ type: actionTypes.MODIFY_FORM_PROPERTIES, props });
    } catch (error) {}
};
