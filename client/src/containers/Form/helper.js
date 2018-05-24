import axios from 'axios';

import { typeCheck, findByQID, findBySequence, CONSTS } from '../../utils';
import * as checker from '../Fields/checker';

export const findCurrentResponse = (target, responses) =>
    responses.find(({ qid }) => qid === target);

//selected: selected index
//current: current sequence
export const getConnected = (questions, selected, current) => {
    console.log('current: ', current);
    // debugger;
    const { type, connect } = questions.find(
        ({ sequence }) => sequence === current
    );

    if (!typeCheck.isSingleChoice(type)) {
        console.error('this question is not supposed to have logic');
        return;
    }

    //it might not be connected afterall
    const connected = JSON.parse(connect).find(
        ({ key }) => key === selected[0]
    );

    //selected is an array because need to ensure it is consistent across single choice and multiple choice
    return connected ? findByQID(questions, connected.qid).sequence : false;
};

export const getConnectedAll = (questions, current) => {
    const { type, connect } = questions.find(
        ({ sequence }) => sequence === current
    );

    if (!typeCheck.isSingleChoice(type)) {
        console.error('this question is not supposed to have logic');
        return;
    }

    const ret = {
        keys: [],
        qids: [],
        seqs: []
    };

    JSON.parse(connect).forEach(({ key, qid }) => {
        ret.keys = ret.keys.concat(key);
        ret.qids = ret.qids.concat(qid);
        ret.seqs = ret.seqs.concat(findByQID(questions, qid).sequence);
    });

    return ret;
};

export class Path {
    constructor() {
        this.path = [];
    }

    get trace() {
        return this.path;
    }

    add(seq) {
        //don't proceed if there is duplicating entry
        if (this.path.find(path => path === seq) === undefined) {
            this.path = this.path.concat(seq);
        }
    }

    //can be int or array
    delete(deleteSeq) {
        if (Array.isArray(deleteSeq))
            deleteSeq.forEach(seq => this._doDelete(seq));
        else this._doDelete(deleteSeq);
    }

    _doDelete = ele => {
        const target = this.path.findIndex(pt => pt === ele);
        if (target > -1) this.path.splice(target, 1);
    };

    getHistory = current => {
        //if there is only 2 trace then just return first one
        if (this.path.length === 2) return this.path[0];

        let history = null;

        this.path.forEach((trace, index) => {
            if (trace === current) history = this.path[index - 1];
        });

        return history;
    };
}

//this function will verify all the responses against the questions
//return result and sanitised response to store in DB (not reducer)
//result: false, responses: []
export const verifySubmission = (questions, responses) => {
    const verifiedResponses = reduceResponses(questions, responses);
    let result = true;

    //first check: if the verified responses cut something off, means something must be wrong in the form
    if (responses.length !== verifiedResponses.length) result = false;

    //second check: find for missing response if any
    questions.forEach(({ _id, validation }) => {
        const parsed = JSON.parse(validation);
        if (parsed.isRequired) {
            if (findCurrentResponse(_id, responses) === undefined)
                result = false;
        }
    });

    return {
        submittable: result,
        responses: verifiedResponses
    };
};

export const submit = async (fid, data) => {
    const ret = {};

    const payload = {
        timestamp: Date.now(),
        data: JSON.stringify(data)
    };

    try {
        await axios.post(`/api/forms/${fid}/responses`, payload);
        ret.submitted = true;
    } catch ({ response, request, message }) {
        if (response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(response.data);
        } else if (request) {
            // The request was made but no response was received
            console.error(request);
        } else console.error('Error: ', message);
    }

    return ret;
};

const reduceResponses = (questions, responses) => {
    return questions.reduce((verified, question) => {
        const { _id, type, validation } = question;
        const parsed = JSON.parse(validation);
        const response = findCurrentResponse(_id, responses);
        const { TYPE } = CONSTS;

        if (!parsed.isRequired && !response) return verified;

        if (parsed.isRequired && !response) return verified;

        const { qid, value, selected, selectedOID } = response;

        if (parsed.minCharCount) {
            const min = parseInt(parsed.minCharCount, 10);
            const test = checker.minLength(value, min);
            if (!test) return verified;
        }

        if (parsed.maxCharCount) {
            const max = parseInt(parsed.maxCharCount, 10);
            const test = checker.maxLength(value, max);
            if (!test) return verified;
        }

        if (type === TYPE.EMAIL) {
            const test = checker.email(value);
            if (!test) return verified;
        }

        if (type === TYPE.LINK) {
            const test = checker.isValidUrl(value);
            if (!test) return verified;
        }

        if (type === TYPE.NUMBER || type === TYPE.CURRENCY) {
            const test = checker.numeric(value);
            if (!test) return verified;
        }

        if (type === TYPE.MULTIPLE_CHOICE) {
            if (parsed.isRequired) {
                const test = checker.checkChoiceMin(selected, 1);
                if (!test) return verified;
            }

            if (parsed.minChoice) {
                const min = parseInt(parsed.minChoice, 10);
                const test = checker.checkChoiceMin(selected, min);
                if (!test) return verified;
            }

            if (parsed.maxChoice) {
                const max = parseInt(parsed.maxChoice, 10);
                const test = checker.checkChoiceMax(response.selected, max);
                if (!test) return verified;
            }
        }

        if (selectedOID === null) verified.push({ qid, value });
        else verified.push({ qid, value, selectedOID });

        return verified;
    }, []);
};

export const getBlackListed = (questions, responses, path) => {
    return path.reduce((list, trace) => {
        //step 1: find out current question first
        const question = findBySequence(questions, trace);

        //step 2: know if it was fill in or not
        const response = findCurrentResponse(question._id, responses);

        //if it is undefined, means people don't complete the question, ignore.
        if (response === undefined) return list;

        //step 3: user must have complete the question, check if it is single choice
        if (!typeCheck.isSingleChoice(question.type)) return list;

        //after all the check, it must be a single choice question
        //double check if it contains selected value
        if (response.selectedOID && response.selectedOID.length === 0)
            return list;

        //it will be null when we unselect
        if (
            response.selectedOID === null ||
            !Array.isArray(response.selectedOID)
        )
            return list;

        // need to know if there are any logic attached to the question
        const connect = JSON.parse(question.connect);
        if (connect.length <= 1) return list;

        connect.forEach(({ key, qid }) => {
            //ignore selected element
            //selectedOID is an array (e.g.: 0: "HkHPvrEJQ")
            console.log(response);
            if (response.selectedOID[0] !== key) {
                //need to know if it is inside the list
                //it is in the list, need to remove the one at the list also
                const found = list.indexOf(qid);
                if (found > -1) list.splice(found, 1);
                //everything okay, push that into blacklist
                else list.push(qid);
            }
        });

        // console.log('connect: ', connect);
        return list;
    }, []);
};

export const getEffectiveBlackList = (list, current, questions) => {
    if (list.length === 0) return list;

    return list.filter(blackQID => {
        const question = findByQID(questions, blackQID);
        const sequence = question.sequence;
        return sequence > current;
    });
};
