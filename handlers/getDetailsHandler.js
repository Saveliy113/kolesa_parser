import chalk from 'chalk';
import { getPageContent } from '../helpers/puppeteer.js';
import * as cheerio from 'cheerio';

export default async function getDetailsHandler(url) {
  try {
    console.log(chalk.green(`Getting data from: `) + chalk.green.bold(url));

    const detailsContent = await getPageContent(url);
    const $ = cheerio.load(detailsContent);
    const model = $('.offer__title').text().replace(/\s+/g, ' ').trim();
    const price = $('.offer__price').text().replace(/\s+/g, ' ').trim();
    const mileage = $('dt[title="Пробег"] + dd').text().trim();
    const generation = $('dt[title="Поколение"] + dd').text().trim();
    const color = $('dt[title="Цвет"] + dd').text().trim();
    const engine = $('dt[title="Объем двигателя, л"] + dd').text().trim();
    const city = $('dt[title="Город"] + dd').text().trim();

    const car = {
      city,
      model,
      generation,
      mileage,
      color,
      engine,
      price,
      url,
    };

    return car;
  } catch (error) {
    console.log(error);
    throw {
      errCode: 1,
      errMessage: `[getDetailsHandler]: error while getting data from ${url}`,
    };
  }
}
