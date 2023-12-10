import * as cheerio from 'cheerio';
import chalk from 'chalk';
import { slugify } from 'transliteration';

import { arrayFromLength } from './helpers/common.js';
import { getPageContent } from './helpers/puppeteer.js';
import listItemsHandler from './handlers/listItemsHanlder.js';

const SITE = 'https://kolesa.kz/cars/toyota/camry/';
const initialPage = 72;

(async function main() {
  let pageContent = await getPageContent(SITE);
  let $ = cheerio.load(pageContent);
  const totalPages = +$('.pager ul li:last span a').text();

  try {
    for (const page of arrayFromLength(totalPages).slice(initialPage - 1)) {
      console.log(
        chalk.bgBlueBright.bold(`   📄 Page ${page} of ${totalPages}   `)
      );
      const carsItems = [];
      if (page !== 1) {
        const url = `${SITE}/?page=${page}`;
        pageContent = await getPageContent(url);
        $ = cheerio.load(pageContent);
      }

      $('.a-card__link').each((i, header) => {
        const url = $(header).attr('href');
        const title = $(header).text();
        if (!title.includes('\n')) {
          carsItems.push({
            title: title.trim(),
            url: `https://kolesa.kz${url}`,
            code: slugify(title),
          });
        }
      });

      await listItemsHandler(carsItems);

      console.log(carsItems);
    }
  } catch (error) {
    console.log(chalk.red('An error has occured \n'));
    console.log(error);
  }
})();
