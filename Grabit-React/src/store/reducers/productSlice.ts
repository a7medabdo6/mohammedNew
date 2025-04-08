import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getProducts, { GetProductsParams, ProductsResponse } from "@/servers/Products";

interface ProductState {
  products: ProductsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  loading: false,
  error: null,
};

// Async Thunk لجلب المنتجات
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (params: GetProductsParams = {}, { rejectWithValue }) => {
    const response = await getProducts(params);
    if (!response) {
      return rejectWithValue("فشل تحميل المنتجات.");
    }
    return response;
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
