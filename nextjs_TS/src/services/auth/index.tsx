import axios from 'axios';
import axiosInstance from 'src/configs/axiosInstance';

export const login = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post('/users/login', { email, password });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};
