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

describe('user want to visit an invalid form', async () => {
    it('shows splash screen when FID is wrong.', async () => {
        await page.goto(`${BASE_URL}/form/1234`);
        const splashHeader = await page.getSelected('.Splash__Header');
        const title = await page.title();
        expect(title).toEqual('Sorry!');
        expect(splashHeader).toEqual('Sorry.');
    });
});
