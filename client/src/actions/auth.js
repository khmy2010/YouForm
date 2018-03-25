import axios from 'axios';

import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
    console.log('fetch user');
    const res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
};
