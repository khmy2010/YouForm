const puppeteer = require('puppeteer');

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
        return path ? `${baseUrl}/${path}` : baseUrl;
    }

    async select(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }
}

module.exports = SuperPage;
