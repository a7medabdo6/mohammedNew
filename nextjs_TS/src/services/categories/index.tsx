import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';

interface CategoryData {
    name: {
        ar: string;
        en: string;
    };
    icon:string;
}

interface CategoryDataEdit {
    nameAr: string;
    nameEn: string;
    parentCategory?: string;
}

export const createMainCategory = async (categoryData: CategoryData) => {
    const formattedData = {
        nameAr: categoryData.name.ar,  // تعديل الاسم
        nameEn: categoryData.name.en,
        icon:categoryData.icon   // تعديل الاسم
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


// export const getCategories = async () => {
//     try {
//         const response = await axiosInstance.get('/categories');
//         return response.data;
//     } catch (error: unknown) {
//         if (axios.isAxiosError(error)) {
//             throw error.response?.data || 'خطأ غير متوقع';
//         }
//         throw 'حدث خطأ غير معروف';
//     }
// };

export const getCategories = async (page = 1, limit = 5, search = '') => {
    try {
        const response = await axiosInstance.get('/categories', {
            params: { page, limit, search },
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};




// 🎭 تحديث الفئة الرئيسية بطريقة ممتعة 🎭
export const updateCategory = async (categoryId: string, categoryData: CategoryDataEdit) => {
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

// 🎭 تحديث الفئة الفرعية بطريقة ممتعة 🎭
export const updateSubCategory = async (subCategoryId: string, subCategoryData: CategoryDataEdit) => {
    try {
        const response = await axiosInstance.put(`/categories/sub/${subCategoryId}`, subCategoryData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};


export const getCategoryById = async (categoryId: string) => {
    try {

        const response = await axiosInstance.get(`/categories/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching category:", error);
        throw error;
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


export const deleteSubCategory = async (subCategoryId: string) => {
    try {
        const response = await axiosInstance.delete(`/categories/sub/${subCategoryId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};


