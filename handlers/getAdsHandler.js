import { slugify } from 'transliteration';
import { getPageContent } from '../helpers/puppeteer.js';
import * as cheerio from 'cheerio';

export default async function getAdsHandler(url) {
  let pageContent = null;
  const items = [];

  try {
    pageContent = await getPageContent(url);
    const $ = cheerio.load(pageContent);

    $(
      '.a-list .a-list__item .a-card .a-card__info .a-card__header .a-card__title .a-card__link'
    ).each((i, header) => {
      const link = $(header).attr('href');
      const title = $(header).text();
      if (!title.includes('\n')) {
        items.push({
          title: title.trim(),
          url: `https://kolesa.kz${link}`,
          code: slugify(title),
        });
      }
    });

    return items;
  } catch (error) {
    throw {
      errCode: 1,
      errMessage: `[getAdsHandler]: error while getting ads from page`,
    };
  }
}
