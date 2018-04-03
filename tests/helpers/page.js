const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/session');
const userFactory = require('../factories/user');
const formFactory = require('../factories/form');

const BASE_URL = 'http://localhost:3000';

class SuperPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const superPage = new SuperPage(page);

        return new Proxy(superPage, {
            get: function(target, property) {
                return (
                    superPage[property] || browser[property] || page[property]
                );
            }
        });
    }

    constructor(page) {
        this.page = page;
        this.user = null;
    }

    async login() {
        this.user = await userFactory();
        const { session, sig } = sessionFactory(this.user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto(BASE_URL);
    }

    async populateForm(name) {
        return await formFactory.createForm(this.user, name);
    }

    async getLocation() {
        return this.page.evaluate('location.href');
    }

    async getSelected(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async getInputTextValue(selector) {
        return this.page.$eval(selector, el => el.value);
    }
}

module.exports = SuperPage;
