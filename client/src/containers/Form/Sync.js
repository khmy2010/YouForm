//this file only knows how to sync with local
class Sync {
    constructor(store) {
        this.store = store;
    }

    save(questions, responses) {
        const respondedQIDs = responses.map(({ qid }) => qid);

        const filtered = questions
            .filter(({ _id }) => respondedQIDs.indexOf(_id) > -1)
            .map(question => {
                const obj = { ...question };
                delete obj.description;
                delete obj.title;

                return obj;
            });

        this.store.set({
            questions: filtered,
            responses
        });
    }
}

export default Sync;
