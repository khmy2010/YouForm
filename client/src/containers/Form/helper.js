import { typeCheck, findByQID } from '../../utils';

export const findCurrentResponse = (target, responses) =>
    responses.find(({ qid }) => qid === target);

//selected: selected index
//current: current sequence
export const getConnected = (questions, selected, current) => {
    console.log('current: ', current);
    const { type, connect } = questions.find(
        ({ sequence }) => sequence === current
    );

    if (!typeCheck.isSingleChoice(type)) {
        console.error('this question is not supposed to have logic');
        return;
    }

    const qid = JSON.parse(connect).find(({ key }) => key === selected).qid;
    return findByQID(questions, qid).sequence;
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
