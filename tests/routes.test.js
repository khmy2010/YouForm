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

describe('user has logged in', async () => {
    beforeEach(async () => {
        await page.login();
    });

    it('should be able to get the forms', async () => {
        await page.populateForms();
        const results = await page._ajax('GET', '/api/forms');

        results.forEach(res => {
            expect(res).toHaveProperty('_id');
            expect(res).toHaveProperty('name');
            expect(res.name).toMatch(/[a-zA-Z]/);
        });
    });
});
