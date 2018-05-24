import uaParser from 'ua-parser-js';
import axios from 'axios';

import Store from './Store';

class Track {
    constructor(fid) {
        this.fid = fid;
        this.key = `__form__meta__${fid}`;
        this.store = new Store(this.key);
        this.userAgent = new uaParser();
        this.type = null;
        this.track();
    }

    async track() {
        //need to check store if we got that before
        if (this.store.get() !== null) return;

        switch (this.userAgent.getOS().name) {
            case 'Android':
            case 'iOS':
            case 'Bada':
            case 'BlackBerry':
            case 'Symbian':
            case 'Tizen':
            case 'Nintendo':
                this.type = 'mobile';
                break;
            default:
                this.type = 'desktop';
                break;
        }

        //need to set store
        this.store.set({ type: this.type, timestamp: Date.now() });
        await axios.post(`/api/forms/${this.fid}/track`, { type: this.type });
    }
}

export default Track;
