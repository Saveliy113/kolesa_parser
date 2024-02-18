import puppeteer from 'puppeteer';

export const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    'window-size=1920x1080',
  ],
  headless: 'new',
};

export const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 20000,
  waitUntil: 'networkidle2',
  timeout: 50000,
};

export async function getPageContent(url) {
  let browser;
  try {
    browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTS);
    const content = await page.content();

    return content;
  } catch (error) {
    throw {
      errCode: 1,
      errMessage: `Puppeteer getting page content error: ${error}`,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
