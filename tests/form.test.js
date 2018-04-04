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

describe('user visits an invalid form', async () => {
    it('shows splash screen when FID is wrong.', async () => {
        await page.goto(`${BASE_URL}/form/1234`);
        const splashHeader = await page.getSelected('.Splash__Header');
        const title = await page.title();
        await page.screenshot({ path: 'fuck.png' });
        expect(title).toEqual('Sorry!');
        expect(splashHeader).toEqual('Sorry.');
    });
});

describe('user visits a valid form', async () => {
    let form;
    const name = 'Hi Patrick';

    beforeEach(async () => {
        await page.login();
        form = await page.populateForm(name);
    });

    it('should shows correct form title', async () => {
        await page.goto(`${BASE_URL}/forms/${form._id}`);
        await page.waitFor('h1');
        const formTitle = await page.getSelected('h1');
        expect(formTitle).toEqual(name);
    });
});
