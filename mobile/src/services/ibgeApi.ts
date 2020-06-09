import axios from 'axios';

const ibge = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api',
});

export default ibge;