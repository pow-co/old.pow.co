import useSWR from 'swr';

//export const BASE = `/api/v1`;
export const API_BASE = process.env.API_BASE || `https://pow.co`;

import axios from 'axios';

//const axiosInstance = axios.create({ baseURL: process.env.HOST_API_KEY || '' });
const axiosInstance = axios.create({ baseURL: API_BASE });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export function fetcher(params: any) {
  return axiosInstance(params).then(({ data }) => {

    return data;
  });
}

export default function useAPI(path: string) {

  console.log('USE API')

  console.log('useApi', { path });

  let { data, error, mutate: refresh, isValidating: loading } = useSWR(`${API_BASE}${path}`, fetcher);

  console.log(data)

  return { data, error, refresh, loading };
}
