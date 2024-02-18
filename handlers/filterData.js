import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default async function filterData() {
  const filteredData = [];

  try {
    console.log(chalk.bgGreen('Filtering duplicatingData...'));

    const jsonData = await fs.promises.readFile(
      path.resolve(__dirname, '..', 'data', 'cars.json'),
      'utf-8'
    );

    const data = JSON.parse(jsonData);

    for (const item of data) {
      const itemExists = filteredData.find(
        (newItem) => newItem.url === item.url
      );

      if (!itemExists) {
        filteredData.push(item);
      }
    }

    await fs.promises.writeFile(
      path.join(__dirname, '..', 'data', 'cars.json'),
      JSON.stringify(filteredData)
    );

    console.log(chalk.bgGreen('Data filtered successfully...'));
    return;
  } catch (error) {
    throw {
      errCode: 2,
      errMessage: '[filterData]: error while filtering data',
    };
  }
}
