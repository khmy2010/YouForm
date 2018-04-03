const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

describe('login flow', async () => {
    beforeEach(async () => {
        await page.login();
    });

    it('should able to see the logout button', async () => {
        const text = await page.getSelected('a[href="/api/logout"]');
        expect(text).toEqual('Logout');
    });
});
