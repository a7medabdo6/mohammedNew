import axiosInstance from 'src/configs/axiosInstance';
import axios from 'axios';

interface ProductData {
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
    images: string[]; // Array of image URLs
    price: number;
    quantity: number;
    categoryId: string; // ID of the category
    subcategory?: string; // Optional subcategory ID
    reviews?: string[]; // Optional array of review IDs
    rating?: number; // Optional product rating
    isOffer?: boolean; // Whether there’s an offer
    isTopSelling?: boolean; // Whether it's top-selling
    isTopRating?: boolean; // Whether it's top-rated
    isTrending?: boolean; // Whether it's trending
    priceBeforeOffer?: number; // Optional, only if `isOffer` is true
}

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
