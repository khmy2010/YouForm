import axios from 'axios';

/*
    Resources:
    1. https://codereview.stackexchange.com/questions/121802/a-reusable-ajax-polling-function
*/

///api/responses/poll {fid, after}
export class Poll {
    constructor(fid, sync, update, visits) {
        this.fid = fid;
        this.url = '/api/responses';
        this.poll = null;
        this.interval = 5000; //in ms
        this.sync = sync;
        this.before = Date.now();
        this.update = update;
        this.visits = visits;
    }

    start() {
        this.poll = setInterval(this.ajax, this.interval);
    }

    end() {
        //clear interval return undefined, need to clear manually
        clearInterval(this.poll);
        this.poll = null;
    }

    success(data, timestamp) {
        //if there is a success case, then we change the before
        //only call sync if there is new data

        this.visits(data);

        if (data.responses.length > 0) {
            this.before = Date.now();
            this.sync(data, timestamp);
        } else {
            this.update(diff(this.before));
        }
    }

    ajax = async () => {
        try {
            const after = Date.now();

            const res = await axios.post('/api/responses/poll', {
                fid: this.fid,
                before: this.before,
                after
            });
            this.success(res.data, after);
        } catch (e) {
            console.error(e);
            this.end();
        }
    };
}

//calculate the difference between timestamp and return text representation of that
export const diff = timestamp => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let text = '';

    if (seconds <= 1) text = `moments ago`;
    else if (seconds <= 60)
        text = `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    else if (seconds <= 3600) {
        const minutes = Math.floor(seconds / 60);
        text = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        const hours = Math.floor(seconds / 60 / 60);
        text = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    return text;
};

export const mapResponsesToQuestions = (questions, responses) => {
    const available = questions.map(({ _id }) => _id);

    const ret = {};

    available.forEach(qid => {
        ret[qid] = [];
    });

    responses.forEach(response => {
        JSON.parse(response.data).forEach(({ qid, value, selectedOID }) => {
            if (!exist(available, qid)) return false;

            ret[qid] = selectedOID
                ? ret[qid].concat(selectedOID)
                : ret[qid].concat(value);
        });
    });

    return ret;
};

export const countResponses = (questions, responses) => {
    const ret = {};

    questions.forEach(({ _id }) => {
        ret[_id] = responses.reduce((acc, { data }) => {
            JSON.parse(data).forEach(({ qid }) => {
                if (qid === _id) acc += 1;
            });
            return acc;
        }, 0);
    });

    return ret;
};

const exist = (arr, ele) => arr.indexOf(ele) > -1;
