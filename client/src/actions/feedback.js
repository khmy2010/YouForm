import axios from 'axios';

import * as actionTypes from './types';

export const fetchAllFeedbacks = fid => async dispatch => {
    dispatch({ type: actionTypes.FETCH_ALL_FEEDBACKS });
    try {
        const res = await axios.get(`/api/feedbacks/${fid}`);
        dispatch({
            type: actionTypes.FETCH_ALL_FEEDBACKS_SUCCESS,
            data: res.data
        });
    } catch (error) {
        dispatch({
            type: actionTypes.FETCH_ALL_FEEDBACKS_FAILED
        });
    }
};

export const adminReply = (fid, qid, pid, content, name) => async dispatch => {
    const obj = {
        question: qid,
        parent: pid,
        timestamp: Date.now(),
        content: content,
        nickName: name,
        isOwner: true,
        fid: fid
    };

    try {
        const res = await axios.post(`/api/feedbacks`, obj);
        dispatch({ type: actionTypes.ADD_POST, data: obj, id: res.data._id });
    } catch (error) {
        console.error(error);
    }
};
