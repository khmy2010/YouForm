const Page = require('./helpers/page');

let page;
jest.setTimeout(1000000); //fuck my laptop :)

beforeEach(async () => {
    page = await Page.build();
    await page.goto(page.url(), { timeout: 300000 });
});

afterEach(async () => {
    await page.close();
});

it('should render home page correctly', async () => {
    const element = await page.select('.Landing');
    expect(element.length).toBeGreaterThan(1);
});

describe('user has not logged in', async () => {
    it('should initiates oAuth flow when clicked log in', async () => {
        await page.click('a[href="/app/login"]');
        await page.waitFor('button');
        await page.screenshot({ path: 'fuck me.png' });
        await page.click('.Login-LoginWithGoogle');
        await page.waitFor('h1');
        await page.screenshot({ path: 'fuck you.png' });

        const url = await page.url();
        console.log(url);

        // expect(url).toMatch(/accounts\.google\.com/);
    });
});
