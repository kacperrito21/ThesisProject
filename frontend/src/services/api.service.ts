import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);
export const apiService = {
    get: async <T>(url: string): Promise<T> => {
        const response = await apiClient.get<T>(url);
        return response.data;
    },
    post: async <T>(url: string, data?: any): Promise<T> => {
        const response = await apiClient.post<T>(url, data);
        return response.data;
    },
    put: async <T>(url: string, data?: any): Promise<T> => {
        const response = await apiClient.put<T>(url, data);
        return response.data;
    },
    delete: async <T>(url: string): Promise<T> => {
        const response = await apiClient.delete<T>(url);
        return response.data;
    },
    testConnection: async (): Promise<string> => {
        return apiService.get<string>('/api/test');
    },
    // getUsers: async (): Promise<User[]> => {
    //   return apiService.get<User[]>('/api/users');
    // },
};

export default apiService;
