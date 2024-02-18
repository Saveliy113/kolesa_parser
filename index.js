import chalk from 'chalk';
import dotenv from 'dotenv';

import adsListPageHandler from './handlers/adsListPageHandler.js';
import getAdsHandler from './handlers/getAdsHandler.js';
import getDetailsHandler from './handlers/getDetailsHandler.js';
import checkInternetConnection from './helpers/checkInternetConnection.js';
import { saveInformation } from './helpers/saveInformation.js';
import filterData from './handlers/filterData.js';

// Accessing env variables
dotenv.config();

(async function main() {
  const state = {
    isStarting: true,
    internetConnection: undefined,
    totalPages: 0,
    currentPage: 1,
    currentItem: 1,
    links: [],
    items: [],
  };

  while (true) {
    try {
      // При первом запуске проверяем интернет соединение,
      //получаем общее количество страниц
      if (state.isStarting) {
        console.log(chalk.bold.green('🚀 Starting parsing proccess'));
        state.isStarting = false;
        await checkInternetConnection();
        state.internetConnection = true;
        console.log(chalk.green('😎 You are ready to parse!'));
      }

      // Если пропало интернет соединение, проверяем его.
      // если восстановлено, продолжаем парсинг
      if (!state.internetConnection && !state.isStarting) {
        await checkInternetConnection();
        state.internetConnection = true;
        console.log(chalk.green('😎 You are back online'));
      }

      // Получаем общее количество страниц
      if (!state.totalPages) {
        state.totalPages = await adsListPageHandler(process.env.SITE);
        console.log(chalk.green(`Total pages count: ${state.totalPages}`));
      }

      // Получаем объявления со страницы
      if (!state.links.length) {
        const url =
          state.currentPage !== 1
            ? `${process.env.SITE}?page=${state.currentPage}`
            : process.env.SITE;
        console.log(chalk.yellow(`Getting page ${state.currentPage} links...`));
        const adsLinks = await getAdsHandler(url);
        state.links = adsLinks;
        console.log(
          chalk.bold.bgGreen(
            `📃 Page ${state.currentPage} of ${state.totalPages}`
          )
        );
      }

      // Получаем данные с каждого объявления
      for (const details of state.links.slice(state.currentItem - 1)) {
        const car = await getDetailsHandler(details.url);
        state.items.push(car);
        state.currentItem++;
      }
      await saveInformation(state.items);

      // Если все объявления со страницы обработаны, очищаем состояние
      // и переходим к следующей странице
      state.items = [];
      state.links = [];
      state.currentItem = 1;
      state.currentPage += 1;

      if (state.currentPage === state.totalPages) {
        await filterData();
        console.log(chalk.bgGreen('🏁 Parsing finished. Enjoy your data!'));
        return;
      }
    } catch (error) {
      if (error?.errCode === 400) {
        return;
      }

      if (error?.errCode === 1) {
        state.internetConnection = false;
        console.log(
          chalk.red('Internet connection is not available. Retrying...')
        );
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }

      console.log(error);
      return;
    }
  }
})();
