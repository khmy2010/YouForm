import * as actionsTypes from '../actions/types';

import { organisePosts } from '../utils';

const initialState = {
    loading: true,
    threads: null,
    topics: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case actionsTypes.FETCH_ALL_FEEDBACKS_SUCCESS:
            const { posts } = action.data;
            return {
                ...state,
                loading: false,
                threads: posts,
                topics: organisePosts(posts)
            };
        case actionsTypes.FETCH_ALL_FEEDBACKS_FAILED:
            return {
                ...state,
                loading: false
            };
        case actionsTypes.ADD_POST:
            const newThread = {
                ...action.data,
                _id: action.id
            };

            const newThreads = state.threads.concat(newThread);

            return {
                ...state,
                threads: newThreads,
                topics: organisePosts(newThreads)
            };
        default:
            return state;
    }
}
