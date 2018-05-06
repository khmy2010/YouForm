//this file only knows how to sync with local
import { typeCheck, findBySequence } from '../../utils';

class Sync {
    constructor(path, fid, store) {
        this.path = path;
        this.fid = fid;
        this.store = store;
    }

    /*
        responses obj:
        qid
        selected
        type
        valid
        value
    */
    save(questions, responses) {
        const map = this.path.trace.map(footprint => {
            return {
                seq: footprint,
                qid: findBySequence(questions, footprint)._id
            };
        });

        const respondedQIDs = responses.map(({ qid }) => qid);

        const filtered = questions
            .filter(({ _id }) => respondedQIDs.indexOf(_id) > -1)
            .map(question => {
                const obj = {};

                obj.options = question.options;
                obj.sequence = question.sequence;
                obj.validation = question.validation;
                obj._id = question._id;
                obj.type = question.type;

                if (typeCheck.isSingleChoice(question.type)) {
                    obj.connect = question.connect;
                    obj.options = question.options;
                }

                return obj;
            });

        this.store.set({
            questions: filtered,
            map,
            responses
        });
    }

    sync(stored, questions) {
        // console.log('stored: ', stored);
        // console.log('questions: ', questions);
    }
}

export default Sync;
