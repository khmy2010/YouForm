const Page = require('./helpers/page');

let page;
const BASE_LINK = 'http://localhost:3000';

beforeEach(async () => {
    page = await Page.build();
    await page.goto(BASE_LINK);
});

afterEach(async () => {
    await page.close();
});

it('should render home page correctly', async () => {
    const element = await page.getSelectedContent('.Landing');
    expect(element.length).toBeGreaterThan(1);
});

it('should render 404 given unknown path', async () => {
    await page.goto(`${BASE_LINK}/23423532532`);
    await page.waitFor('.NotFound-Content h2');
    const header = await page.getSelectedContent('.NotFound-Content h2');
    expect(header).toEqual('Houston, we have a problem.');
});

describe('user has not logged in', async () => {
    it('should initiates oAuth flow when clicked log in', async () => {
        await page.click('a[href="/app/login"]');
        await page.waitFor('button');
        const url = await page.getLocation();
        expect(url).toBe('http://localhost:3000/app/login');
    });
});

describe('user has logged in', async () => {
    beforeEach(async () => {
        await page.login();
    });

    it('should sees logout button', async () => {
        await page.goto(`${BASE_LINK}`);
        await page.screenshot({ path: 'fuck.png' });
        await page.waitFor('a[href="/api/logout"]');
        const text = await page.getSelectedContent('a[href="/api/logout"]');
        expect(text).toBe('Logout');
    });
});
