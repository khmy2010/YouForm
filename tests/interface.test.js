const Page = require('./helpers/page');

let page;
const BASE_URL = 'http://localhost:3000';

beforeEach(async () => {
    page = await Page.build();
    await page.goto(BASE_URL);
});

afterEach(async () => {
    await page.close();
});

describe('user has not logged in', async () => {
    it('should able to see the home page', async () => {
        const text = await page.getSelected('#Landing__Intro');
        expect(text.length).toBeGreaterThan(0);
    });

    it('should able to see the correct document title', async () => {
        const text = await page.title();
        expect(text).toEqual('YouForm');
    });
});

describe('user has logged in', async () => {
    beforeEach(async () => {
        await page.login();
    });

    it('should able to see the home page', async () => {
        const text = await page.getSelected('#Landing__Intro');
        expect(text.length).toBeGreaterThan(0);
    });

    it('should able to see the correct document title', async () => {
        const text = await page.title();
        expect(text).toEqual('YouForm');
    });

    it('should able to see the logout button', async () => {
        const text = await page.getSelected('a[href="/api/logout"]');
        expect(text).toEqual('Logout');
    });

    it('should able to see the dashboard button', async () => {
        const text = await page.getSelected('a[href="/app/dashboard"]');
        expect(text).toEqual('Dashboard');
    });
});
