import axios from 'axios';

export default async function checkInternetConnection() {
  try {
    await axios.get('https://www.google.com');
    return;
  } catch (error) {
    throw { errCode: 1, errMessage: 'Internet connection problem' };
  }
}
