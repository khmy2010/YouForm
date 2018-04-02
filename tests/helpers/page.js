const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/session');
const userFactory = require('../factories/user');
const formFactory = require('../factories/forms');

const BASE_LINK = 'http://localhost:3000';

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

    constructor(page, browser) {
        this.page = page;
        this.user = null;
    }

    async login() {
        this.page.setDefaultNavigationTimeout(30000000); //fuck my laptop :)

        this.user = await userFactory();
        const { session, sig } = sessionFactory(this.user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto(`${BASE_LINK}/app/dashboard`, {
            timeout: 0
        }); //refresh
    }

    async populateForms() {
        await formFactory(this.user);
    }

    async getSelectedContent(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async getLocation() {
        return this.page.evaluate('location.href');
    }

    async hello() {
        console.log(hello);
    }

    //make an ajax request to the API server
    async _ajax(type, path, data) {
        return this.page.evaluate(
            async (_type, _path, _data) => {
                const result = await fetch(_path, {
                    method: _type,
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                });
                return result.json();
            },
            type,
            path,
            data
        );
    }
}

module.exports = SuperPage;
