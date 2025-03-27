import apiClient from "@/api/apiClient";
import { showErrorToast, showSuccessToast } from "@/components/toast-popup/Toastify";

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await apiClient.post<LoginResponse>("/users/login", { email, password });

    if (response.data?.user && response.data?.token) {
      const { user, token } = response.data;

      // ✅ إضافة `token` داخل كائن `user`
      const userWithToken: User = { ...user, token };

      // 🔒 تخزين البيانات في localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userWithToken));

      showSuccessToast("Login successful!");
      return userWithToken;
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    console.error("❌ Login error:", error);

    // ⚠️ تحسين عرض رسائل الخطأ
    const errorMessage =
      error.response?.data?.message ||
      "An unexpected error occurred. Please try again.";
    showErrorToast(errorMessage);

    return null;
  }
};

export default loginUser;
