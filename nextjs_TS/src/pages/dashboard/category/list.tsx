import { useEffect, useState } from 'react';
import { Card,Grid, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Container, Collapse, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getCategories, createMainCategory, createSubCategory, updateCategory, getCategoryById,deleteCategory, deleteSubCategory ,updateSubCategory} from 'src/services/categories';
import Scrollbar from '../../../components/scrollbar';
import DashboardLayout from '../../../layouts/dashboard';
import { ExpandMore, ExpandLess, Edit,Delete } from '@mui/icons-material';
import React from 'react';

interface Subcategory {
  _id: string;
  name: string;
  productCount: number;
  subcategories: Subcategory[];
}


interface Category {
  _id: string;
  name: string;
  icon: string;
  productCount: number;
  subcategories: Subcategory[];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [categoryType, setCategoryType] = useState<'main' | 'sub'>('main');
  const [newCategoryNameAr, setNewCategoryNameAr] = useState('');
  const [newCategoryNameEn, setNewCategoryNameEn] = useState('');
  const [parentId, setParentId] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);  const limit = 5;

  const [openSubEditModal, setOpenSubEditModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<Subcategory | null>(null);
  const [newSubNameAr, setNewSubNameAr] = useState('');
  const [newSubNameEn, setNewSubNameEn] = useState('');
  const [iconName, setIconName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(page, limit, searchTerm);
        setCategories(data.categories);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [page, searchTerm]);

  const handleToggle = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleCreateCategory = async () => {
    try {
      if (categoryType === 'main') {
        await createMainCategory({ name: { ar: newCategoryNameAr, en: newCategoryNameEn },icon:iconName });
      } else {
        await createSubCategory({ name: { ar: newCategoryNameAr, en: newCategoryNameEn }, parentId });
      }
      setOpenModal(false);
      setNewCategoryNameAr('');
      setNewCategoryNameEn('');
      setParentId('');
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  const handleEditCategory = async (categoryId: string) => {
    try {
        const response = await getCategoryById(categoryId);

        if (!response || !response.category) {
            throw new Error('Category data is missing');
        }


        const categoryData = response.category;
        console.log('Fetched category:', categoryData);

        setEditingCategory(categoryData);

        // ✅ تعيين القيم الصحيحة للنصوص
        setNewCategoryNameAr(categoryData.name?.ar || '');
        setNewCategoryNameEn(categoryData.name?.en || '');
        
        // ✅ التحقق مما إذا كانت الفئة فرعية
        if (categoryData.parentCategory) {
            setCategoryType('sub');
            setParentId(categoryData.parentCategory._id || '');
        } else {
            setCategoryType('main');
            setParentId('');
        }

        console.log('Opening edit modal');
        setOpenEditModal(true);
    } catch (error) {
        console.error('Error fetching category:', error);
    }
};

  
const handleUpdateCategory = async () => {
  try {
      if (editingCategory) {
          const updatedData: any = {
              nameAr: newCategoryNameAr,
              nameEn: newCategoryNameEn,
          };

          if (categoryType === 'sub') {
              await updateSubCategory(editingCategory._id, updatedData);
          } else {
              // ✅ تحديث فئة رئيسية باستخدام updateCategory
              await updateCategory(editingCategory._id, updatedData);
          }
      }
      
      setOpenEditModal(false);
      setEditingCategory(null);
      setNewCategoryNameAr('');
      setNewCategoryNameEn('');
      setParentId('');
  } catch (error) {
      console.error('Error updating category:', error);
  }
};

const handleEditSubCategory = (sub: Subcategory) => {
  setEditingSubCategory(sub);
  setNewSubNameAr(sub.name.ar);
  setNewSubNameEn(sub.name.en);
  setOpenSubEditModal(true);
};

const handleUpdateSubCategory = async () => {
  try {
    if (editingSubCategory) {
      const updatedData = {
        nameAr: newSubNameAr,
        nameEn: newSubNameEn,
      };

      await updateSubCategory(editingSubCategory._id, updatedData);

      setOpenSubEditModal(false);
      setEditingSubCategory(null);
      setNewSubNameAr('');
      setNewSubNameEn('');

      // تحديث القائمة بعد التعديل
      const updatedCategories = await getCategories(page, limit, searchTerm);
      setCategories(updatedCategories.categories);
    }
  } catch (error) {
    console.error('Error updating subcategory:', error);
  }
};


const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الفئة وجميع الفئات الفرعية؟')) return;

    try {
        await deleteCategory(categoryId);
        alert('✅ تم حذف الفئة بنجاح!');
        // يمكنك هنا إعادة تحميل البيانات بعد الحذف
    } catch (error) {
        alert(error);
    }
};

const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!window.confirm('هل أنت متأكد أنك تريد حذف هذه الفئة الفرعية؟')) return;

    try {
        await deleteSubCategory(subCategoryId);
        alert('✅ تم حذف الفئة الفرعية بنجاح!');
        // يمكنك هنا إعادة تحميل البيانات بعد الحذف
    } catch (error) {
        alert(error);
    }
};

  return (
    <Container maxWidth="lg">
      <Card>
      <div style={{ padding: '1rem' }}>
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={8}>
      <TextField
        label="بحث عن التصنيفات"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setOpenModal(true)}
        sx={{ minWidth: '180px', height: '100%' }}
      >
        إضافة تصنيف جديد
      </Button>
    </Grid>
  </Grid>
</div>

        <Scrollbar>
        <TableContainer>
  <Table sx={{ minWidth: 650, border: '1px solid #ddd' }}>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
        <TableCell align="center"></TableCell>
        <TableCell align="center"><strong>الاسم</strong></TableCell>
        <TableCell align="center"><strong>عدد المنتجات</strong></TableCell>
        <TableCell align="center"><strong>التصنيفات الفرعية</strong></TableCell>
        <TableCell align="center"><strong>الإجراءات</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {categories.map((category) => (
        <React.Fragment key={category._id}>
          <TableRow sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
            <TableCell align="center">
              {category.subcategories.length > 0 && (
                <IconButton size="small" onClick={() => handleToggle(category._id)}>
                  {openCategory === category._id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </TableCell>
            <TableCell align="center">{category.name}</TableCell>
            <TableCell align="center">{category.productCount}</TableCell>
            <TableCell align="center">
              {category.subcategories.length > 0 ? `${category.subcategories.length} تصنيف فرعي` : 'لا يوجد'}
            </TableCell>
            <TableCell align="center">
              <IconButton onClick={() => handleEditCategory(category._id)} color="primary" size="small">
                <Edit fontSize="small" />
              </IconButton>
            </TableCell>
            <TableCell align="center">
  <IconButton onClick={() => handleDeleteCategory(category._id)} color="error" size="small">
    <Delete fontSize="small" />
  </IconButton>
</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} style={{ padding: 0 }}>
              <Collapse in={openCategory === category._id} timeout="auto" unmountOnExit>
                <Table size="small" sx={{ marginLeft: 4 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                      <TableCell align="center"><strong>اسم التصنيف الفرعي</strong></TableCell>
                      <TableCell align="center"><strong>عدد المنتجات</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.subcategories.map((sub) => (
                      <TableRow key={sub._id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                        <TableCell align="center">{sub.name}</TableCell>
                        <TableCell align="center">{sub.productCount}</TableCell>
                        <TableCell align="center">
                                  <IconButton onClick={() => handleEditSubCategory(sub)} color="primary" size="small">
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </TableCell>
                                <TableCell align="center">
  <IconButton onClick={() => handleDeleteSubCategory(sub._id)} color="error" size="small">
    <Delete fontSize="small" />
  </IconButton>
</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>


        </Scrollbar>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>السابق</Button>
          <span style={{ margin: '0 1rem' }}>الصفحة {page} من {totalPages}</span>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>التالي</Button>
        </div>
      </Card>

      {/* Modal for adding category */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>إضافة تصنيف جديد</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>نوع التصنيف</InputLabel>
            <Select value={categoryType} onChange={(e) => setCategoryType(e.target.value as 'main' | 'sub')}>
              <MenuItem value="main">تصنيف رئيسي</MenuItem>
              <MenuItem value="sub">تصنيف فرعي</MenuItem>
            </Select>
          </FormControl>
          {categoryType === 'sub' && (
            <FormControl fullWidth margin="dense">
              <InputLabel>التصنيف الرئيسي</InputLabel>
              <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField fullWidth margin="dense" label="الاسم بالعربية" value={newCategoryNameAr} onChange={(e) => setNewCategoryNameAr(e.target.value)} />
          <TextField fullWidth margin="dense" label="الاسم بالإنجليزية" value={newCategoryNameEn} onChange={(e) => setNewCategoryNameEn(e.target.value)} />
          <TextField
        fullWidth
        margin="dense"
        label="أيقونة التصنيف (مثال: Home, Category, Medical)"
        value={iconName}
        onChange={(e) => setIconName(e.target.value)}
      />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>إلغاء</Button>
          <Button onClick={handleCreateCategory} color="primary">إضافة</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
    <DialogTitle>تعديل التصنيف</DialogTitle>
    <DialogContent>
        <FormControl fullWidth margin="dense">
            <InputLabel>نوع التصنيف</InputLabel>
            <Select value={categoryType} onChange={(e) => setCategoryType(e.target.value as 'main' | 'sub')}>
                <MenuItem value="main">تصنيف رئيسي</MenuItem>
                {/* <MenuItem value="sub">تصنيف فرعي</MenuItem> */}
            </Select>
        </FormControl>

        {categoryType === 'sub' && (
            <FormControl fullWidth margin="dense">
                <InputLabel>التصنيف الرئيسي</InputLabel>
                <Select value={parentId} onChange={(e) => setParentId(e.target.value)}>
                    {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        )}

        <TextField
            fullWidth
            margin="dense"
            label="الاسم بالعربية"
            value={newCategoryNameAr}
            onChange={(e) => setNewCategoryNameAr(e.target.value)}
        />
        <TextField
            fullWidth
            margin="dense"
            label="الاسم بالإنجليزية"
            value={newCategoryNameEn}
            onChange={(e) => setNewCategoryNameEn(e.target.value)}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenEditModal(false)}>إلغاء</Button>
        <Button onClick={handleUpdateCategory} color="primary">حفظ التغييرات</Button>
    </DialogActions>
</Dialog>

  {/* Modal تعديل الفئة الفرعية */}
  <Dialog open={openSubEditModal} onClose={() => setOpenSubEditModal(false)}>
        <DialogTitle>تعديل التصنيف الفرعي</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="الاسم بالعربية"
            value={newSubNameAr}
            onChange={(e) => setNewSubNameAr(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="الاسم بالإنجليزية"
            value={newSubNameEn}
            onChange={(e) => setNewSubNameEn(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubEditModal(false)}>إلغاء</Button>
          <Button onClick={handleUpdateSubCategory} color="primary">حفظ التغييرات</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

CategoriesPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoriesPage;