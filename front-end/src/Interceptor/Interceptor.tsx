import axios from 'axios'
import {getToken} from '../features/SocketToken'
import { AppDispatch } from "../store/store"
import { useDispatch } from 'react-redux';

const api = axios.create({
    baseURL: 'http://159.65.225.210:3001',
    withCredentials: true,
});

// const dispatch: AppDispatch = useDispatch()

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401 && error.response.data.message === 'Token has expired') {
            try {
                const refreshResponse = await api.get('/auth/refresh');
                // dispatch(getToken());
                return api(error.config);
            } catch (refreshError) {
                console.error('Error during token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (request) => request,
    async (error) => {
        if (error.response && error.response.status === 401 && error.response.data.message === 'Token has expired') {
            try {
                const refreshRequest = await api.get('/auth/refresh');
                // dispatch(getToken());
                return api(error.config);
            } catch (refreshError) {
                console.error('Error during token refresh:', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;