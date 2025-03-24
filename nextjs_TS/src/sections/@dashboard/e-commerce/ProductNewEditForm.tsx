// import * as Yup from 'yup';
// import { useCallback, useEffect, useMemo } from 'react';
// // next
// import { useRouter } from 'next/router';
// // form
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// // @mui
// import { LoadingButton } from '@mui/lab';
// import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
// // routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// // @types
// import { IProduct } from '../../../@types/product';
// // components
// import { CustomFile } from '../../../components/upload';
// import { useSnackbar } from '../../../components/snackbar';
// import FormProvider, {
//   RHFSwitch,
//   RHFSelect,
//   RHFEditor,
//   RHFUpload,
//   RHFTextField,
//   RHFRadioGroup,
//   RHFAutocomplete,
// } from '../../../components/hook-form';

// // ----------------------------------------------------------------------

// const GENDER_OPTION = [
//   { label: 'Men', value: 'Men' },
//   { label: 'Women', value: 'Women' },
//   { label: 'Kids', value: 'Kids' },
// ];

// const CATEGORY_OPTION = [
//   { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
//   { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
//   { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
// ];

// const TAGS_OPTION = [
//   'Toy Story 3',
//   'Logan',
//   'Full Metal Jacket',
//   'Dangal',
//   'The Sting',
//   '2001: A Space Odyssey',
//   "Singin' in the Rain",
//   'Toy Story',
//   'Bicycle Thieves',
//   'The Kid',
//   'Inglourious Basterds',
//   'Snatch',
//   '3 Idiots',
// ];

// // ----------------------------------------------------------------------

// interface FormValuesProps extends Omit<IProduct, 'images'> {
//   taxes: boolean;
//   inStock: boolean;
//   images: (CustomFile | string)[];
// }

// type Props = {
//   isEdit?: boolean;
//   currentProduct?: IProduct;
// };

// export default function ProductNewEditForm({ isEdit, currentProduct }: Props) {
//   const { push } = useRouter();

//   const { enqueueSnackbar } = useSnackbar();

//   const NewProductSchema = Yup.object().shape({
//     name: Yup.string().required('Name is required'),
//     images: Yup.array().min(1, 'Images is required'),
//     tags: Yup.array().min(2, 'Must have at least 2 tags'),
//     price: Yup.number().moreThan(0, 'Price should not be $0.00'),
//     description: Yup.string().required('Description is required'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       name: currentProduct?.name || '',
//       description: currentProduct?.description || '',
//       images: currentProduct?.images || [],
//       code: currentProduct?.code || '',
//       sku: currentProduct?.sku || '',
//       price: currentProduct?.price || 0,
//       priceSale: currentProduct?.priceSale || 0,
//       tags: currentProduct?.tags || [TAGS_OPTION[0]],
//       inStock: true,
//       taxes: true,
//       gender: currentProduct?.gender || GENDER_OPTION[2].value,
//       category: currentProduct?.category || CATEGORY_OPTION[0].classify[1],
//     }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [currentProduct]
//   );

//   const methods = useForm<FormValuesProps>({
//     resolver: yupResolver(NewProductSchema),
//     defaultValues,
//   });

//   const {
//     reset,
//     watch,
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const values = watch();

//   useEffect(() => {
//     if (isEdit && currentProduct) {
//       reset(defaultValues);
//     }
//     if (!isEdit) {
//       reset(defaultValues);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isEdit, currentProduct]);

//   const onSubmit = async (data: FormValuesProps) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       reset();
//       enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
//       push(PATH_DASHBOARD.eCommerce.list);
//       console.log('DATA', data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDrop = useCallback(
//     (acceptedFiles: File[]) => {
//       const files = values.images || [];

//       const newFiles = acceptedFiles.map((file) =>
//         Object.assign(file, {
//           preview: URL.createObjectURL(file),
//         })
//       );

//       setValue('images', [...files, ...newFiles], { shouldValidate: true });
//     },
//     [setValue, values.images]
//   );

//   const handleRemoveFile = (inputFile: File | string) => {
//     const filtered = values.images && values.images?.filter((file) => file !== inputFile);
//     setValue('images', filtered);
//   };

//   const handleRemoveAllFiles = () => {
//     setValue('images', []);
//   };

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={8}>
//           <Card sx={{ p: 3 }}>
//             <Stack spacing={3}>
//               <RHFTextField name="name" label="Product Name" />

//               <Stack spacing={1}>
//                 <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
//                   Description
//                 </Typography>

//                 <RHFEditor simple name="description" />
//               </Stack>

//               <Stack spacing={1}>
//                 <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
//                   Images
//                 </Typography>

//                 <RHFUpload
//                   multiple
//                   thumbnail
//                   name="images"
//                   maxSize={3145728}
//                   onDrop={handleDrop}
//                   onRemove={handleRemoveFile}
//                   onRemoveAll={handleRemoveAllFiles}
//                   onUpload={() => console.log('ON UPLOAD')}
//                 />
//               </Stack>
//             </Stack>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Stack spacing={3}>
//             <Card sx={{ p: 3 }}>
//               <RHFSwitch name="inStock" label="In stock" />

//               <Stack spacing={3} mt={2}>
//                 <RHFTextField name="code" label="Product Code" />

//                 <RHFTextField name="sku" label="Product SKU" />

//                 <Stack spacing={1}>
//                   <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
//                     Gender
//                   </Typography>

//                   <RHFRadioGroup row spacing={4} name="gender" options={GENDER_OPTION} />
//                 </Stack>

//                 <RHFSelect native name="category" label="Category">
//                   <option value="" />
//                   {CATEGORY_OPTION.map((category) => (
//                     <optgroup key={category.group} label={category.group}>
//                       {category.classify.map((classify) => (
//                         <option key={classify} value={classify}>
//                           {classify}
//                         </option>
//                       ))}
//                     </optgroup>
//                   ))}
//                 </RHFSelect>

//                 <RHFAutocomplete
//                   name="tags"
//                   label="Tags"
//                   multiple
//                   freeSolo
//                   options={TAGS_OPTION.map((option) => option)}
//                   ChipProps={{ size: 'small' }}
//                 />
//               </Stack>
//             </Card>

//             <Card sx={{ p: 3 }}>
//               <Stack spacing={3} mb={2}>
//                 <RHFTextField
//                   name="price"
//                   label="Regular Price"
//                   placeholder="0.00"
//                   onChange={(event) =>
//                     setValue('price', Number(event.target.value), { shouldValidate: true })
//                   }
//                   InputLabelProps={{ shrink: true }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Box component="span" sx={{ color: 'text.disabled' }}>
//                           $
//                         </Box>
//                       </InputAdornment>
//                     ),
//                     type: 'number',
//                   }}
//                 />

//                 <RHFTextField
//                   name="priceSale"
//                   label="Sale Price"
//                   placeholder="0.00"
//                   onChange={(event) => setValue('priceSale', Number(event.target.value))}
//                   InputLabelProps={{ shrink: true }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <Box component="span" sx={{ color: 'text.disabled' }}>
//                           $
//                         </Box>
//                       </InputAdornment>
//                     ),
//                     type: 'number',
//                   }}
//                 />
//               </Stack>

//               <RHFSwitch name="taxes" label="Price includes taxes" />
//             </Card>

//             <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
//               {!isEdit ? 'Create Product' : 'Save Changes'}
//             </LoadingButton>
//           </Stack>
//         </Grid>
//       </Grid>
//     </FormProvider>
//   );
// }
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, MenuItem } from '@mui/material';

import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFSelect, RHFEditor } from '../../../components/hook-form';
import { createProduct } from 'src/services/products';
import { getCategories } from 'src/services/categories';
interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  _id: string;
  name: string;
}
interface FormValuesProps {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  images: string[]; // تغيير من string إلى string[]
  quantity: number;
  price: number;
  categoryId: string;
  subcategoryId: string;
  isOffer: boolean;
  priceBeforeOffer: number;
  isTopSelling: boolean;
  isTopRating: boolean;
  isTrending: boolean;
  rating: number;
}

type Props = {
  isEdit?: boolean;
  currentProduct?: FormValuesProps;
};

export default function ProductNewEditForm({ isEdit, currentProduct }: Props) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);
  const NewProductSchema = Yup.object().shape({
    nameAr: Yup.string().required('الاسم بالعربية مطلوب'),
    nameEn: Yup.string().required('الاسم بالإنجليزية مطلوب'),
    descriptionAr: Yup.string().required('الوصف بالعربية مطلوب'),
    descriptionEn: Yup.string().required('الوصف بالإنجليزية مطلوب'),
    images: Yup.array().of(Yup.string().required()).min(1, 'يجب إضافة صورة واحدة على الأقل'),
    quantity: Yup.number().min(1, 'يجب أن يكون الكمية 1 على الأقل'),
    price: Yup.number().moreThan(0, 'يجب أن يكون السعر أكبر من 0'),
    categoryId: Yup.string().required('يجب تحديد الفئة'),
    subcategoryId: Yup.string().required('يجب تحديد الفئة الفرعية'),
    priceBeforeOffer: Yup.number().min(0, 'السعر قبل العرض لا يمكن أن يكون سالبًا'),
    rating: Yup.number().min(0).max(5, 'التقييم يجب أن يكون بين 0 و 5'),
  });

  const defaultValues = useMemo(
    () => ({
      nameAr: currentProduct?.nameAr || '',
      nameEn: currentProduct?.nameEn || '',
      descriptionAr: currentProduct?.descriptionAr || '',
      descriptionEn: currentProduct?.descriptionEn || '',
      images: Array.isArray(currentProduct?.images) ? currentProduct.images : [],
      quantity: currentProduct?.quantity || 1,
      price: currentProduct?.price || 0,
      categoryId: currentProduct?.categoryId || '',
      subcategoryId: currentProduct?.subcategoryId || '',
      isOffer: currentProduct?.isOffer || false,
      priceBeforeOffer: currentProduct?.priceBeforeOffer || 0,
      isTopSelling: currentProduct?.isTopSelling || false,
      isTopRating: currentProduct?.isTopRating || false,
      isTrending: currentProduct?.isTrending || false,
      rating: currentProduct?.rating || 0,
    }),
    [currentProduct]
  );


  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues, // بدون `as FormValuesProps`
  });



  const { reset, watch, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentProduct]);
  useEffect(() => {
    const selectedCategory = categories.find((cat) => cat._id === values.categoryId);
    setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
    setValue('subcategoryId', ''); // إعادة تعيين الفئة الفرعية عند تغيير الفئة الرئيسية
  }, [values.categoryId]);
  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (typeof data.images === 'string') {
        data.images = (data.images as string).split(',').map((img) => img.trim());
      } else if (!Array.isArray(data.images)) {
        data.images = [];
      }


      // إرسال البيانات إلى السيرفر عبر createProduct
      await createProduct(data);

      // عرض رسالة نجاح
      enqueueSnackbar('تم إنشاء المنتج بنجاح!', { variant: 'success' });

      // إعادة توجيه المستخدم إلى صفحة المنتجات
      push('/dashboard/e-commerce/list/');

      // إعادة تعيين النموذج
      reset();
    } catch (error: any) {
      if (error?.message?.includes('اسم المنتج موجود بالفعل')) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('حدث خطأ غير متوقع، يُرجى المحاولة مرة أخرى.', { variant: 'error' });
      }
      console.error(error);
    }
  };



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="nameAr" label="اسم المنتج بالعربية" />
              <RHFTextField name="nameEn" label="اسم المنتج بالإنجليزية" />
              <RHFEditor name="descriptionAr" />
              <RHFEditor name="descriptionEn" />
              <RHFTextField
                name="images"
                label="روابط الصور (مفصولة بفاصلة)"
                value={values.images?.join(', ') ?? ''} // التأكد من وجود قيمة
                onChange={(e) => setValue('images', e.target.value.split(',').map(img => img.trim()))}
              />
              <RHFTextField name="quantity" label="الكمية" type="number" />
              <RHFTextField name="price" label="السعر" type="number" />
              {values.isOffer && (
                <RHFTextField name="priceBeforeOffer" label="السعر قبل العرض" type="number" />
              )}
              <RHFTextField name="rating" label="التقييم" type="number" />
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch name="isOffer" label="عرض خاص" />
              <RHFSwitch name="isTopSelling" label="الأكثر مبيعًا" />
              <RHFSwitch name="isTopRating" label="الأعلى تقييمًا" />
              <RHFSwitch name="isTrending" label="منتج رائج" />
               {/* اختيار الفئة */}
               <RHFSelect native name="categoryId" label="الفئة">
                <option value="" />
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </RHFSelect>

              {/* اختيار الفئة الفرعية */}
              <RHFSelect name="subcategoryId" label="الفئة الفرعية" disabled={!values.categoryId}>
                {subcategories.map((sub) => (
                  <MenuItem key={sub._id} value={sub._id}>
                    {sub.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Card>
            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'إنشاء المنتج' : 'حفظ التعديلات'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
