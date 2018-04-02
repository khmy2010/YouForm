const puppeteer = require('puppeteer');

//require factories
const sessionFactory = require('../factories/session');
const userFactory = require('../factories/user');

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
    }

    //path need to be started with /
    url(path) {
        const baseUrl = 'http://localhost:3000';
        return path ? `${baseUrl + path}` : baseUrl;
    }

    async select(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    async login() {
        this.page.setDefaultNavigationTimeout(30000000); //fuck my laptop :)

        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto(this.url('/app/dashboard'), {
            timeout: 0
        }); //refresh

        //might wanna revise this
        await this.page.waitFor('.Dash-Forms-Container'); //if failed you pandai pandai lah har
    }
}

module.exports = SuperPage;
