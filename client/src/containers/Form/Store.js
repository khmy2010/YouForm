class Store {
    constructor(key) {
        this.key = key;
        this.store = window.localStorage;
    }

    get() {
        //this function might fail because of invalid JSON.
        const item = this.store.getItem(this.key);

        if (item === null) return null;

        try {
            const parsed = JSON.parse(item);
            return parsed;
        } catch (error) {
            //there is an error in JSON, remove that
            this.remove();
            return null;
        }
    }

    set(data) {
        this.store.setItem(this.key, JSON.stringify(data));
    }

    remove() {
        this.store.removeItem(this.key);
    }
}

export default Store;
