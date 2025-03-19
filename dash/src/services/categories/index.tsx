import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';

interface CategoryData {
    name: {
        ar: string;
        en: string;
    };
}

export const createMainCategory = async (categoryData: CategoryData) => {
    const formattedData = {
        nameAr: categoryData.name.ar,  // تعديل الاسم
        nameEn: categoryData.name.en   // تعديل الاسم
    };
    try {
        const response = await axiosInstance.post('/categories', formattedData);
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



interface SubCategoryData {
    name: {
        ar: string;
        en: string;
    };
    parentId: string;
}

export const createSubCategory = async (subCategoryData: SubCategoryData) => {
    try {
        const formattedData = {
            nameAr: subCategoryData.name.ar,  // تعديل الاسم
            nameEn: subCategoryData.name.en,  // تعديل الاسم
            parentId: subCategoryData.parentId
        };

        const response = await axiosInstance.post('/categories/sub/', formattedData);
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


export const getCategoryById = async (categoryId: string) => {
    console.log(categoryId)
    try {
        const response = await axiosInstance.get(`/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching category:", error);
        throw error;
    }
};