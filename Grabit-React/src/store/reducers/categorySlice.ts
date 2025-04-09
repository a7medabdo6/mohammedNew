import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getCategories, {
  GetCategoriesParams,
  CategoryResponse,
} from "@/servers/Categories";
import { Category } from "@/types";

interface CategoryState {
    categories: Category[] | null; // مصفوفة الفئات
    totalCategories: number; // عدد الفئات
    totalPages: number; // عدد الصفحات
    currentPage: number; // الصفحة الحالية
    loading: boolean;
    error: string | null;
  }
  

  const initialState: CategoryState = {
    categories: null, // لا توجد فئات في البداية
    totalCategories: 0, // عدد الفئات يبدأ من صفر
    totalPages: 0, // عدد الصفحات يبدأ من صفر
    currentPage: 1, // الصفحة الحالية تبدأ من 1
    loading: false,
    error: null,
  };
  

// Async Thunk لجلب الفئات
export const fetchCategoriesAsync = createAsyncThunk(
  "categories/fetchCategories",
  async (params: GetCategoriesParams = {}, { rejectWithValue }) => {
    const response = await getCategories(params);
    if (!response) {
      return rejectWithValue("فشل تحميل الفئات.");
    }
    return response;
  }
);

// Slice
const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
      clearCategories: (state) => {
        state.categories = null;
        state.loading = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCategoriesAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
            console.log('Categories data:', action.payload);  // طباعة البيانات للتأكد من صحتها


            
          state.categories = action.payload.categories;
          state.totalCategories = action.payload.totalCategories;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
          state.loading = false;
        })
        .addCase(fetchCategoriesAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export const { clearCategories } = categorySlice.actions;
  export default categorySlice.reducer;
  