import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';
interface CategoryData {
    name: {
        ar: string;
        en: string;
    };
}
export const createSubCategory = async (categoryData: CategoryData & { parentCategory: string }) => {
    try {
        const response = await axiosInstance.post('/categories/sub', categoryData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};
