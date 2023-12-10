import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const saveInformation = async (data) => {
  const resultFileExists = fs.existsSync(
    path.join(__dirname, '..', 'data', 'cars.json')
  );

  try {
    if (!resultFileExists) {
      await fs.promises.writeFile(
        path.join(__dirname, '..', 'data', 'cars.json'),
        JSON.stringify(data)
      );
    } else {
      const carsData = await fs.promises.readFile(
        path.resolve(__dirname, '..', 'data', 'cars.json'),
        'utf-8'
      );

      const currentCars = carsData ? JSON.parse(carsData) : [];
      await fs.promises.writeFile(
        path.join(__dirname, '..', 'data', 'cars.json'),
        JSON.stringify([...currentCars, ...data])
      );
    }
  } catch (err) {
    console.error(err);
  }
};
