const Page = require('./helpers/page');
const BASE_URL = 'http://localhost:3000';

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto(BASE_URL);
});

afterEach(async () => {
    await page.close();
});

it('should renders the home page without auth when not logged in', async () => {
    const nav = '.Header__Navigation';
    const discoverySel = '.Header__Navigation li a';
    const loginSel = '.Header__Navigation li:nth-child(2) a';
    await page.waitFor(nav);

    const discovery = await page.getSelected(discoverySel);
    expect(discovery).toEqual('Discovery');
    const dashboard = await page.getSelected(loginSel);
    expect(dashboard).toEqual('Login');
});
