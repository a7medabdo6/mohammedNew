import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';

interface CategoryData {
    name: {
        ar: string;
        en: string;
    };
}

export const createMainCategory = async (categoryData: CategoryData) => {
    try {
        const response = await axiosInstance.post('/categories', categoryData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};


export const getCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};


export const updateCategory = async (categoryId: string, categoryData: CategoryData & { parentCategory?: string }) => {
    try {
        const response = await axiosInstance.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};

export const deleteCategory = async (categoryId: string) => {
    try {
        const response = await axiosInstance.delete(`/categories/${categoryId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};
