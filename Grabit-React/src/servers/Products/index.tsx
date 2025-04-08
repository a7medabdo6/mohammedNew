import apiClient from "@/api/apiClient";
import { showErrorToast } from "@/components/toast-popup/Toastify";

// تعريف واجهات البيانات
export interface ProductReview {
  _id: string;
  user: string;
  rating: number;
  comment: {
    ar: string;
    en: string;
  };
  createdAt: string;
}

export interface ProductCategory {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
}

export interface ProductSubcategory {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
}

export interface Product {
  _id: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  status: string;
  gender: string;
  images: string[];
  price: number;
  category: ProductCategory;
  subcategory?: ProductSubcategory | null;
  reviews: ProductReview[];
  createdAt: string;
  updatedAt: string;
  isOffer: boolean;
  isTopRating: boolean;
  isTopSelling: boolean;
  isTrending: boolean;
  priceBeforeOffer?: number | null;
  quantity: number;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  page: number;
}

export interface GetProductsParams {
  lang?: string;
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  gender?: string;
  isOffer?: boolean;
  isTopRating?: boolean;
  isTopSelling?: boolean;
  isTrending?: boolean;
}

// دالة جلب المنتجات
const getProducts = async ({
  lang = "en",
  page = 1,
  limit = 10,
  search = "",
  categoryId,
  subcategoryId,
  gender,
  isOffer,
  isTopRating,
  isTopSelling,
  isTrending,
}: GetProductsParams = {}): Promise<ProductsResponse | null> => {
  try {
    const response = await apiClient.get<ProductsResponse>("/products", {
      params: {
        lang,
        page,
        limit,
        search,
        categoryId,
        subcategoryId,
        gender,
        isOffer,
        isTopRating,
        isTopSelling,
        isTrending,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    const errorMessage =
      error.response?.data?.message ||
      "فشل في تحميل المنتجات. الرجاء المحاولة مرة أخرى.";
    showErrorToast(errorMessage);
    return null;
  }
};

export default getProducts;
