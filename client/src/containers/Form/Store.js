class Store {
    constructor(key) {
        this.key = key;
        this.store = window.localStorage;
    }

    get() {
        const item = this.store.getItem(this.key);

        return item === null ? null : JSON.parse(item);
    }

    set(data) {
        this.store.setItem(this.key, JSON.stringify(data));
    }

    remove() {
        this.store.removeItem(this.key);
    }
}

export default Store;
