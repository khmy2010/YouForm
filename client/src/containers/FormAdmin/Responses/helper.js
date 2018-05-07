import axios from 'axios';

/*
    Resources:
    1. https://codereview.stackexchange.com/questions/121802/a-reusable-ajax-polling-function
*/

///api/responses/poll {fid, after}
export class Poll {
    constructor(fid, sync) {
        this.fid = fid;
        this.url = '/api/responses';
        this.poll = null;
        this.interval = 5000; //in ms
        this.sync = sync;
        this.before = Date.now();
    }

    start() {
        this.poll = setInterval(this.ajax, this.interval);
    }

    end() {
        //clear interval return undefined, need to clear manually
        clearInterval(this.poll);
        this.poll = null;
    }

    success(data) {
        //if there is a success case, then we change the before
        //only call sync if there is new data
        if (data.length > 0) {
            this.before = Date.now();
            this.sync(data);
        }
    }

    ajax = async () => {
        const after = Date.now();

        try {
            const res = await axios.post('/api/responses/poll', {
                fid: this.fid,
                before: this.before,
                after
            });
            this.success(res.data);
        } catch (e) {
            console.error(e);
            this.end();
        }
    };
}
