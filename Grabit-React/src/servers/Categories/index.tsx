import apiClient from "@/api/apiClient";
import { showErrorToast } from "@/components/toast-popup/Toastify";

// تعريف واجهات البيانات
export interface SubSubcategory {
  _id: string;
  name: string;
  icon: string; // تأكد من إضافة هذه الخاصية

  productCount: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  icon: string; // تأكد من إضافة هذه الخاصية

  productCount: number;
  subcategories: SubSubcategory[];
}

export interface Category {
  _id: string;
  name: string;
  icon: string; // تأكد من إضافة هذه الخاصية

  productCount: number;
  subcategories: Subcategory[];
}

export interface CategoryResponse {
  categories: Category[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
}

export interface GetCategoriesParams {
  lang?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// دالة جلب الفئات
const getCategories = async ({
  lang = "en",
  page = 1,
  limit = 10,
  search = "",
}: GetCategoriesParams = {}): Promise<CategoryResponse | null> => {
  try {
    const response = await apiClient.get<CategoryResponse>("/categories", {
      params: { lang, page, limit, search },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching categories:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Failed to load categories. Please try again.";
    showErrorToast(errorMessage);
    return null;
  }
};

export default getCategories;
