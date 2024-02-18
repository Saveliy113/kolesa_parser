import chalk from 'chalk';
import { getPageContent } from '../helpers/puppeteer.js';
import * as cheerio from 'cheerio';

const adsListPageHandler = async (url) => {
  try {
    if (!url) {
      throw {
        errCode: 400,
        errMessage: 'Invalid URL. Provide valid URL and restart parsing',
      };
    }

    console.log(chalk.yellow('Getting overall pages count...'));
    let pageContent = await getPageContent(url);
    let $ = cheerio.load(pageContent);
    const totalPages = +$('.pager ul li:last span a').text();

    return totalPages;
  } catch (error) {
    if (error?.errCode === 400) {
      console.log(
        chalk.red(
          'Error while getting ads list page content: ',
          error.errMessage
        )
      );
      throw error;
    } else
      throw {
        errCode: 1,
        errMessage:
          '[adsListPageHandler]: failed to load ads list page content',
      };
  }
};

export default adsListPageHandler;
