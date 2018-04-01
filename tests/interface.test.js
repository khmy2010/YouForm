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
