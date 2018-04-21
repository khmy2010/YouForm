import axios from 'axios';

import * as actionTypes from './types';
import { redoSequence, updateConnected } from '../utils';

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
        await dispatch(updateLogics(fid, qid));
    } catch (error) {}
};

export const updateLogics = async (fid, qid) => {
    const questions = await axios.get(`/api/forms/${fid}/questions`);
    const { updated, doRequest } = updateConnected(questions.data, qid);

    //perform AJAX request to the server if it is needed.
    if (doRequest) {
        try {
            await axios.put(`/api/forms/${fid}/questions`, updated);
        } catch (error) {}
    }
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

export const addQuestionUpdateSeq = (
    question,
    fid,
    sequence
) => async dispatch => {
    await dispatch(addQuestion(question, fid));
    dispatch({ type: actionTypes.UPDATE_SEQUENCE, sequence });
    await dispatch(editDBSequence(fid, sequence));
};

export const editQuestionUpdateSeq = (
    question,
    fid,
    qid,
    sequence,
    ori
) => async dispatch => {
    await dispatch(editQuestion(question, fid, qid));
    dispatch({ type: actionTypes.UPDATE_SEQUENCE, sequence, ori });
    await dispatch(editDBSequence(fid, sequence, ori));
};

export const editDBSequence = (fid, sequence, ori) => async dispatch => {
    const res = await axios.get(`/api/forms/${fid}/questions`);
    const processed = redoSequence(res.data, sequence, ori);

    try {
        await axios.put(`/api/forms/${fid}/questions`, processed);
    } catch (error) {}
};
