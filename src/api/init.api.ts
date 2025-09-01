import axios, { AxiosResponse, type AxiosInstance } from 'axios';

const asistify: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_PUBLIC_API_URL}/api`,
  withCredentials: true,
  timeout: 60000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'x-timezone-offset': new Date().getTimezoneOffset() / -60,
  },
});

asistify.interceptors.response.use(
  ({ data }: AxiosResponse) => data,
  async ({ response, code, config }) => {
    if (code === 'ERR_CANCELED') return Promise.reject('ERR_CANCELED');
    if (config.url.includes('/user/refresh')) return;
    if (code === 'ERR_NETWORK')
      return Promise.reject({
        message:
          'Actualmente el servidor no esta disponible, vuelva a intentar dentro de unos minutos.',
      });

    if (response.status === 401 && !config._retry) {
      config._retry = true;
      await asistify.get('/user/refresh');
      const { data } = await axios(config);
      return data;
    } else {
      if ('errors' in response.data) {
        return Promise.reject({
          message: response.data.message,
          errors: response.data.errors,
        });
      }
      return Promise.reject({ message: response.data?.message });
    }
  }
);

export default { asistify };
