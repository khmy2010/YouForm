import * as actionTypes from '../actions/types';
import { typeCheck, findByQID, checkIntegrity } from '../utils';

const initialState = {
    questions: [],
    loading: null,
    error: false,
    errorMsg: null,
    context: null,
    name: null,
    fid: null,
    stored: null,
    loadable: null,
    responses: []
};

const publicReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_FORM_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.FETCH_FORM_SUCCESS:
            return {
                ...state,
                loading: false,
                name: action.res.data.name,
                questions: action.res.data.questions,
                context: action.res.data.context,
                fid: action.fid
            };
        case actionTypes.FETCH_FORM_FAILED:
            return {
                ...state,
                loading: false,
                error: true,
                errorMsg: action.response
            };
        case actionTypes.SYNC_STATE:
            let responses = state.responses.slice();

            //to ensure the behavious is consistent at <Form />
            if (typeCheck.isSingleChoice(action.data.type)) {
                const question = findByQID(state.questions, action.qid);
                const parsedConnect = JSON.parse(question.connect);

                const qids = parsedConnect.map(({ qid }) => qid);
                responses = responses.filter(
                    ({ qid }) => qids.indexOf(qid) === -1
                );
            }

            //check if the response has occured before
            const target = responses.findIndex(({ qid }) => qid === action.qid);

            if (target > -1) responses[target] = action.data;
            else responses.push(action.data);

            return {
                ...state,
                responses
            };
        case actionTypes.LOAD_STATE:
            //there is no data to be loaded
            if (action.data === null) return { ...state, loadable: false };
            else {
                //there is data to be loaded
                const filtered = checkIntegrity(state.questions, action.data);

                return {
                    ...state,
                    stored: filtered.length > 0 ? filtered : null,
                    loadable: filtered.length > 0
                };
            }
        case actionTypes.RESUME_STATE:
            return {
                ...state,
                responses: state.stored
            };
        default:
            return { ...state };
    }
};

export default publicReducer;
