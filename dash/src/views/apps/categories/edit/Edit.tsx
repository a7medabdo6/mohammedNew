"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { TextField, Button, Grid } from "@mui/material";

interface CategoryEditFormProps {
  id: string;
  category: {
    _id: string;
    name: string;
    description?: string;
  };
}

const CategoryEditForm = ({ id, category }: CategoryEditFormProps) => {
  const [categoryData, setCategoryData] = useState(category);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Updating Category:", categoryData);
    // هنا يمكنك استدعاء دالة API لتحديث الفئة
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="اسم الفئة"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="الوصف"
            name="description"
            value={categoryData.description || ""}
            onChange={handleChange}
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            حفظ التعديلات
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CategoryEditForm;
