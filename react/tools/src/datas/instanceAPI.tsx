import axios from 'axios';

const BASE_URL = "https://" + import.meta.env.VITE_HOSTNAME + ":"
						+ import.meta.env.VITE_PROXY_PORT + "/api/";

export const instanceAPI = axios.create({
	baseURL: BASE_URL,
	timeout: 1000
});
