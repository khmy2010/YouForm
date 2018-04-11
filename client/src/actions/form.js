import axios from 'axios';

import * as actionTypes from './types';

export const fetchFormAdmin = (
    fid,
    history,
    state,
    valid
) => async dispatch => {
    try {
        const res = await axios.get(`/api/forms/admin/${fid}`);
        dispatch({ type: actionTypes.FETCH_FORM_ADMIN_SUCCESS, res });
        dispatch({ type: actionTypes.INIT_FORM, res });
        if (valid) {
            history.replace(`/app/admin/${res.data._id}/${state}`);
        } else history.replace(`/app/admin/${res.data._id}/build`);
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
    try {
        await axios.delete(`/api/forms/${fid}/questions/${qid}`);
        dispatch({ type: actionTypes.DELETE_QUESTION, qid });
    } catch (error) {}
};

export const editQuestion = (question, fid, qid) => async dispatch => {
    try {
        await axios.put(`/api/forms/${fid}/questions/${qid}`, question);
        dispatch({ type: actionTypes.EDIT_QUESTION, qid, question });
    } catch (error) {}
};

export const changeFormProperties = (fid, props) => async dispatch => {
    try {
        await axios.patch(`/api/forms/${fid}`, props);
        dispatch({ type: actionTypes.MODIFY_FORM_PROPERTIES, props });
    } catch (error) {}
};

export const fetchForm = fid => async dispatch => {
    try {
        const res = await axios.get(`/api/forms/${fid}`);
        dispatch({ type: actionTypes.INIT_FORM, res });
    } catch ({ response }) {
        dispatch({ type: actionTypes.FETCH_FORM_FAILED, response });
    }
};

export const updateContext = (fid, context) => async dispatch => {
    try {
        await axios.post(`/api/forms/${fid}/context`, context);
        dispatch({ type: actionTypes.UPDATE_CONTEXT, context });
    } catch (error) {}
};
