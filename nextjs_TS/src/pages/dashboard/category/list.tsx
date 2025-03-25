import { useEffect, useState } from 'react';
import { Card, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Container, Collapse, IconButton, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getCategories, createMainCategory, createSubCategory, updateCategory, getCategoryById } from 'src/services/categories';
import Scrollbar from '../../../components/scrollbar';
import DashboardLayout from '../../../layouts/dashboard';
import { ExpandMore, ExpandLess, Edit } from '@mui/icons-material';
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
        await createMainCategory({ name: { ar: newCategoryNameAr, en: newCategoryNameEn } });
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
      const categoryData = await getCategoryById(categoryId);
      setEditingCategory(categoryData);
      setNewCategoryNameAr(categoryData.name.ar);
      setNewCategoryNameEn(categoryData.name.en);
      setOpenEditModal(true);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, {
          name: { ar: newCategoryNameAr, en: newCategoryNameEn },
        });
      }
      setOpenEditModal(false);
      setEditingCategory(null);
      setNewCategoryNameAr('');
      setNewCategoryNameEn('');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  return (
    <Container maxWidth="lg">
      <Card>
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search Categories"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
            إضافة تصنيف جديد
          </Button>
        </div>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Product Count</TableCell>
                  <TableCell>Subcategories</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.map((category) => (
                  <React.Fragment key={category._id}>
                    <TableRow>
                      <TableCell>
                        {category.subcategories.length > 0 && (
                          <IconButton onClick={() => handleToggle(category._id)}>
                            {openCategory === category._id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.productCount}</TableCell>
                      <TableCell>
                        {category.subcategories.length > 0 ? `${category.subcategories.length} Subcategories` : 'None'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} style={{ padding: 0 }}>
                        <Collapse in={openCategory === category._id} timeout="auto" unmountOnExit>
                          <Table size="small" sx={{ marginLeft: 4 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Subcategory Name</TableCell>
                                <TableCell>Product Count</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {category.subcategories.map((sub) => (
                                <TableRow key={sub._id}>
                                  <TableCell>{sub.name}</TableCell>
                                  <TableCell>{sub.productCount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditCategory(category._id)} color="primary">
                          <Edit />
                        </IconButton>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>إلغاء</Button>
          <Button onClick={handleCreateCategory} color="primary">إضافة</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>تعديل التصنيف</DialogTitle>
        <DialogContent>
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
    </Container>
  );
};

CategoriesPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoriesPage;