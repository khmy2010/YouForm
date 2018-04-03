const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/session');
const userFactory = require('../factories/user');

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
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto(BASE_URL);
    }

    async getSelected(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = SuperPage;
