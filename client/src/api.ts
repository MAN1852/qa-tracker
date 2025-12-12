import axios from 'axios';
import type { Application } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
    getApplications: async () => {
        const response = await axios.get<Application[]>(`${API_URL}/applications`);
        return response.data;
    },

    createApplication: async (data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => {
        const response = await axios.post<Application>(`${API_URL}/applications`, data);
        return response.data;
    },

    updateApplication: async (id: string, data: Partial<Application>) => {
        const response = await axios.put<Application>(`${API_URL}/applications/${id}`, data);
        return response.data;
    },

    getAnalytics: async () => {
        const response = await axios.get(`${API_URL}/analytics`);
        return response.data;
    }
};
