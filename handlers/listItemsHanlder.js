import * as cheerio from 'cheerio';
import chalk from 'chalk';
import { getPageContent } from '../helpers/puppeteer.js';
import { saveInformation } from '../helpers/saveInformation.js';

export default async function listItemsHandler(data) {
  const cars = [];
  try {
    for (const initialData of data) {
      console.log(
        chalk.green(`Getting data from: `) + chalk.green.bold(initialData.url)
      );
      const detailsContent = await getPageContent(initialData.url);
      const $ = cheerio.load(detailsContent);
      const model = $('.offer__title').text().replace(/\s+/g, ' ').trim();
      const price = $('.offer__price').text().replace(/\s+/g, ' ').trim();
      const mileage = $('dt[title="Пробег"] + dd').text().trim();
      const generation = $('dt[title="Поколение"] + dd').text().trim();
      const color = $('dt[title="Цвет"] + dd').text().trim();
      const engine = $('dt[title="Объем двигателя, л"] + dd').text().trim();
      const url = initialData.url;

      const car = {
        model,
        generation,
        mileage,
        color,
        engine,
        price,
        url,
      };

      console.log(car);
      cars.push(car);
    }

    saveInformation(cars);
  } catch (err) {
    throw err;
  }
}

async function saveData(data) {}
