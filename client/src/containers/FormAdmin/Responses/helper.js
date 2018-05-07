import axios from 'axios';

/*
    Resources:
    1. https://codereview.stackexchange.com/questions/121802/a-reusable-ajax-polling-function
*/

///api/responses/poll {fid, after}
export class Poll {
    constructor(fid) {
        this.fid = fid;
        this.url = '/api/responses';
        this.poll = null;
        this.interval = 5000; //in ms
    }

    start() {
        this.poll = setInterval(this.ajax, this.interval);
    }

    end() {
        //clear interval return undefined, need to clear manually
        clearInterval(this.poll);
        this.poll = null;
    }

    ajax = async () => {
        const after = Date.now();

        try {
            await axios.post('/api/responses/poll', { fid: this.fid, after });
        } catch (e) {
            console.error(e);
        }
    };
}
