import * as actionTypes from '../actions/types';
import { typeCheck, findByQID } from '../utils';

const initialState = {
    questions: [],
    loading: null,
    error: false,
    errorMsg: null,
    context: null,
    name: null,
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
                context: action.res.data.context
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
        default:
            return { ...state };
    }
};

export default publicReducer;
