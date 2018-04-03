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

describe('user has logged in', async () => {
    let form;
    const name = 'This is my form.';

    beforeEach(async () => {
        await page.login();
        form = await page.populateForm(name);
    });

    afterEach(async () => {
        form.removeForm();
    });

    it('form admin should shows correct file name', async () => {
        const selector = '.FormAdmin__Name';
        await page.goto(`${BASE_URL}/app/admin/${form._id}`);
        await page.waitFor(selector);
        const text = await page.getInputTextValue(selector);
        expect(text).toEqual(name);
    });
});
