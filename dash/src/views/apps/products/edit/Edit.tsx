"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from "@mui/material";
import { updateProduct } from "src/services/products";
import { getCategories } from "src/services/categories";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface Category {
  _id: string;
  name: string;
  subcategories: { _id: string; name: string; }[];
}

export interface ProductData {
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  images: string[];
  price: number;
  quantity: number;
  category?: string;
  subcategory?: string;
  isOffer: boolean;
  priceBeforeOffer?: number;
  isTopSelling: boolean;
  isTopRating: boolean;
  isTrending: boolean;
}

interface ProductEditFormProps {
  id: string;
  product: ProductData;
}

const ProductEditForm = ({ id, product }: ProductEditFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category["subcategories"]>([]);
  const [productData, setProductData] = useState<ProductData>({
    ...product,
    category: (product.category as any)?._id || product.category || "",
    subcategory: (product.subcategory as any)?._id || product.subcategory || "",
  });



  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategories();
        setCategories(result);

        // ✅ التحقق مما إذا كانت category كائنًا يحتوي على _id أو مجرد string
        const categoryId =
          typeof product.category === "object" && product.category !== null
            ? (product.category as any)._id
            : product.category;

        // ✅ البحث باستخدام _id إذا كان متاحًا
        const foundCategory = result.find((cat: { _id: any; }) => cat._id === categoryId);

        if (foundCategory) {
          setSubcategories(foundCategory.subcategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [product.category]);


  useEffect(() => {
    if (productData.category) {
      const selectedCategory = categories.find((cat) => cat._id === productData.category);
      setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    }
  }, [productData.category, categories]);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setProductData((prev) => {
      // ✅ التعامل مع الحقول التي تحتوي على كائنات متداخلة مثل name و description
      if (name.startsWith("name.") || name.startsWith("description.")) {
        const [parent, child] = name.split(".") as ["name" | "description", "ar" | "en"];

        return {
          ...prev,
          [parent]: {
            ...((prev[parent] as Record<string, string>) || {}), // تأكد من أن الحقل كائن وليس undefined
            [child]: value,
          },
        };
      }

      // ✅ تحديث الصور وتحويلها إلى مصفوفة
      if (name === "images") {
        return { ...prev, images: value.split(",").map((img) => img.trim()) };
      }

      // ✅ عند تغيير الفئة، يتم مسح الفئة الفرعية
      if (name === "category") {
        return { ...prev, category: value, subcategory: "" };
      }

      // ✅ تحديث باقي الحقول (بما في ذلك الـ checkbox)
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };


  const handleDescriptionChange = (field: "ar" | "en", value: string) => {
    setProductData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await updateProduct(id, productData);
      setMessage("✅ تم تحديث المنتج بنجاح!");
      toast.success("✅ تم تحديث المنتج بنجاح!");

    } catch (error) {
      setMessage(`❌ فشل التحديث: ${error}`);
      toast.error(`❌ فشل التحديث: ${error}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2} >
        <Grid item xs={12} md={6} style={{ marginBottom: 20 }}>
          <TextField fullWidth label="اسم المنتج (عربي)" name="name.ar" value={productData.name.ar} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6} style={{ marginBottom: 20 }} >
          <TextField fullWidth label="Product Name (English)" name="name.en" value={productData.name.en} onChange={handleChange} required />
        </Grid>

        <Grid item xs={12}>
          <label>الوصف (عربي)</label>
          <ReactQuill theme="snow" value={productData.description.ar} onChange={(value) => handleDescriptionChange("ar", value)} style={{ height: 250, marginBottom: 50 }} />
        </Grid>
        <Grid item xs={12}>
          <label>Description (English)</label>
          <ReactQuill theme="snow" value={productData.description.en} onChange={(value) => handleDescriptionChange("en", value)} style={{ height: 250, marginBottom: 50 }} />
        </Grid>

        <Grid item xs={12} style={{ marginBottom: 20 }} >
          <TextField fullWidth label="صور المنتج (روابط مفصولة بفاصلة)" name="images" value={productData.images.join(", ")} onChange={handleChange} required />
        </Grid>

        <Grid item xs={12} md={6} style={{ marginBottom: 20 }}>
          <TextField fullWidth type="number" label="السعر" name="price" value={productData.price} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6} style={{ marginBottom: 20 }}>
          <TextField fullWidth type="number" label="الكمية" name="quantity" value={productData.quantity} onChange={handleChange} required />
        </Grid>
        <FormControl fullWidth style={{ marginBottom: 20 }}>
          <InputLabel>الفئة</InputLabel>
          <Select name="category" value={productData.category || ""} onChange={handleChange}>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: 20 }}>
          <InputLabel>الفئة الفرعية</InputLabel>
          <Select name="subcategory" value={productData.subcategory || ""} onChange={handleChange}>
            {subcategories.map((sub) => (
              <MenuItem key={sub._id} value={sub._id}>
                {sub.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <FormControlLabel control={<Checkbox name="isOffer" checked={productData.isOffer} onChange={handleChange} />} label="هل عليه عرض؟" />
          {productData.isOffer && (
            <TextField type="number" label="السعر قبل العرض" name="priceBeforeOffer" value={productData.priceBeforeOffer ?? 0} onChange={handleChange} required />
          )}
        </Grid>

        <Grid item xs={12} style={{ marginBottom: 20 }}>
          <FormControlLabel control={<Checkbox name="isTopSelling" checked={productData.isTopSelling} onChange={handleChange} />} label="من الأكثر مبيعًا؟" />
          <FormControlLabel control={<Checkbox name="isTopRating" checked={productData.isTopRating} onChange={handleChange} />} label="من الأعلى تقييمًا؟" />
          <FormControlLabel control={<Checkbox name="isTrending" checked={productData.isTrending} onChange={handleChange} />} label="منتج شائع؟" />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? "جاري التحديث..." : "تعديل المنتج"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductEditForm;