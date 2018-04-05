const Page = require('./helpers/page');
const formFactory = require('./factories/form');

let page;
const name = 'Patrick';
const BASE_URL = 'http://localhost:3000';

beforeEach(async () => {
    page = await Page.build();
    await page.goto(BASE_URL);
});

afterEach(async () => {
    await page.close();
});

it('shows splash screen when FID is invalid.', async () => {
    await page.goto(`${BASE_URL}/forms/1234`);
    await page.waitForSelector('.Splash');
    const splashHeader = await page.getSelected('h1');
    const title = await page.title();
    expect(title).toEqual('Sorry!');
    expect(splashHeader).toEqual('Sorry.');
});

it('shows splash screen when FID is valid but does not exist.', async () => {
    await page.goto(`${BASE_URL}/forms/5aab7df2bce6de00148a1570`);
    await page.waitForSelector('.Splash');
    const splashHeader = await page.getSelected('h1');
    const title = await page.title();
    expect(title).toEqual('Sorry!');
    expect(splashHeader).toEqual('Sorry.');
});

it("shows 404 when use old link ('/form').", async () => {
    await page.goto(`${BASE_URL}/form/1234`);
    const notFoundHeader = await page.getSelected('h2');
    expect(notFoundHeader).toEqual('Houston, we have a problem.');
});

it('should shows correct form title', async () => {
    const form = await formFactory.backDoor(name);
    await page.goto(`${BASE_URL}/forms/${form._id}`);
    await page.waitFor('h1');
    const formTitle = await page.getSelected('h1');
    expect(formTitle).toEqual(name);
    form.removeForm();
});
