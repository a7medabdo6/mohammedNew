import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';

export interface ProductData {
    _id?: string;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    images: string[];
    price: number;
    quantity: number;
    categoryId: string;
    subcategory?: string;
    reviews?: string[];
    rating?: number;
    isOffer?: boolean;
    isTopSelling?: boolean;
    isTopRating?: boolean;
    isTrending?: boolean;
    priceBeforeOffer?: number;
}

// إنشاء منتج جديد
export const createProduct = async (productData: ProductData) => {
    try {
        const response = await axiosInstance.post('/products/', productData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};

// جلب جميع المنتجات
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products/');
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};

// جلب منتج واحد حسب الـ ID
export const getProductById = async (productId: string) => {
    try {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};

// تحديث بيانات منتج
export const updateProduct = async (productId: string, productData: Partial<ProductData>) => {
    try {
        const response = await axiosInstance.put(`/products/${productId}`, productData);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};

// حذف منتج
export const deleteProduct = async (productId: string) => {
    try {
        const response = await axiosInstance.delete(`/products/${productId}`);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || 'خطأ غير متوقع';
        }
        throw 'حدث خطأ غير معروف';
    }
};
