import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// next
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { IProduct } from '../../../@types/product';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import ConfirmDialog from '../../../components/confirm-dialog';
// sections
import { ProductTableRow, ProductTableToolbar } from '../../../sections/@dashboard/e-commerce/list';
import { deleteProduct, getAllProducts } from 'src/services/products';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//   { id: 'name', label: 'Product', align: 'left' },
//   { id: 'createdAt', label: 'Create at', align: 'left' },
//   { id: 'inventoryType', label: 'Status', align: 'center', width: 180 },
//   { id: 'price', label: 'Price', align: 'right' },
//   { id: '' },
// ];

interface Product {
  id?: string; // الآن `_id` ليس مطلوبًا
  _id?: string; // الآن `_id` ليس مطلوبًا

  name: {
    en?: string;
  };
  description?: {
    en?: string;
  }; price: number;
  priceBeforeOffer: number;
  quantity: number;
  category?: {
    name?: {
      en?: string;
    };
  };
  subcategory?: {
    name?: {
      en?: string;
    };
  };

  images: string;
  createdAt: string;
  updatedAt: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  isOffer: boolean;
  isTopSelling: boolean;
  isTopRating: boolean;
  isTrending: boolean;
  inventoryType?: string; // ✅ أضف `inventoryType` هنا إذا كان اختياريًا

}

interface DataType {
  totalProducts: number;
}



const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'image', label: 'image', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'Stock', label: 'Stock', align: 'left' },



  { id: 'category', label: 'Category', align: 'left' },
  { id: 'subcategory', label: 'Subcategory', align: 'left' },
  { id: 'price', label: 'Price', align: 'right' },
  { id: 'priceBeforeOffer', label: 'Old Price', align: 'right' }, // السعر قبل العرض
  { id: 'quantity', label: 'quantity', align: 'center' },
  // { id: 'status', label: 'Status', align: 'center' },
  { id: 'rating', label: 'Rating', align: 'center' },
  { id: 'isOffer', label: 'Offer', align: 'center' }, // هل عليه عرض؟
  { id: 'status', label: 'status', align: 'center' }, // هل من الأكثر مبيعًا؟

  { id: '' },
];



const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

// ----------------------------------------------------------------------

EcommerceProductListPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

// ----------------------------------------------------------------------

export default function EcommerceProductListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    setRowsPerPage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const { themeStretch } = useSettingsContext();

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  // const { products, isLoading } = useSelector((state) => state.product);

  // const [tableData, setTableData] = useState<IProduct[]>([]);
  const [tableData, setTableData] = useState<Product[]>([]);

  const [filterName, setFilterName] = useState('');
  const [data, setData] = useState<DataType | null>(null);

  const [filterStatus, setFilterStatus] = useState<string[]>([]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null); // حالة للأخطاء
  const [loading, setLoading] = useState<boolean>(true); // حالة التحميل
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products, page, rowsPerPage]);




  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts({
          page: page + 1, // لأن API غالبًا ما يستخدم صفحات تبدأ من 1
          limit: rowsPerPage
        });
        setProducts(data.products);
        setData(data);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, rowsPerPage]); // يتم التحديث عند تغيير الصفحة أو عدد العناصر

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const formattedData: Product[] = products.map((product) => ({
        id: product._id || '',
        name: { en: product.name?.en || 'Unknown' },
        description: { en: product.description?.en?.replace(/<\/?p>/g, '') || '' },
        price: product.price || 0,
        priceBeforeOffer: product.priceBeforeOffer || product.price || 0,
        quantity: product.quantity || 0,
        category: product.category && typeof product.category === 'object'
          ? { name: { en: product.category.name?.en || 'Unknown' } }
          : { name: { en: 'Unknown' } }, // ✅ تأكد من أن `category` كائن وليس نص
        subcategory: product.subcategory && typeof product.subcategory === 'object'
          ? { name: { en: product.subcategory.name?.en || 'Unknown' } }
          : { name: { en: 'Unknown' } }, // ✅ نفس الأمر مع `subcategory`
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '',
        createdAt: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '',
        updatedAt: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '',
        status: product.quantity > 10 ? 'in_stock' : product.quantity > 0 ? 'low_stock' : 'out_of_stock',
        rating: product.rating || 0,
        isOffer: !!product.isOffer,
        isTopSelling: !!product.isTopSelling,
        isTopRating: !!product.isTopRating,
        isTrending: !!product.isTrending,
      }));

      setTableData(formattedData);
    } else {
      setTableData([]); // تأكد من إعادة التهيئة عند عدم وجود بيانات
    }
  }, [products]);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const denseHeight = dense ? 60 : 80;

  const isFiltered = filterName !== '' || !!filterStatus.length;

  const isNotFound = (!dataFiltered.length && !!filterName) || (!loading && !dataFiltered.length);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterStatus = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPage(0);
    setFilterStatus(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteRow = async (id: string) => {
    try {
      await deleteProduct(id); // استدعاء API لحذف المنتج

      const updatedTableData = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(updatedTableData);

      if (page > 0 && dataInPage.length < 2) {
        setPage(page - 1);
      }

      enqueueSnackbar('تم حذف المنتج بنجاح!', { variant: 'success' });
      handleCloseConfirm()
    } catch (error) {
      enqueueSnackbar(error || 'حدث خطأ أثناء حذف المنتج', { variant: 'error' });
    }
  };


  const handleDeleteRows = (selectedRows: string[]) => {
    const deleteRows = tableData.filter(
      (row) => row.id !== undefined && !selectedRows.includes(row.id)
    );
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage = Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id: string) => {
    push(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const handleViewRow = (id: string) => {
    push(PATH_DASHBOARD.eCommerce.view(paramCase(id)));
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  return (
    <>
      <Head>
        <title> Ecommerce: Product List | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Product List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: 'List' },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.eCommerce.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Product
            </Button>
          }
        />

        <Card>
          <ProductTableToolbar
            filterName={filterName}
            filterStatus={filterStatus}
            onFilterName={handleFilterName}
            onFilterStatus={handleFilterStatus}
            statusOptions={STATUS_OPTIONS}
            isFiltered={isFiltered}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id).filter((id): id is string => id !== undefined)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id).filter((id): id is string => id !== undefined)
                    )
                  }
                />

                <TableBody>
                  {tableData
                    .map((row, index) =>
                      row ? (
                        <ProductTableRow
                          key={row.id}
                          row={{
                            ...row,
                            name: row.name?.en || 'Unknown', // ✅ تحويل `name` إلى نص فقط
                            category: row.category?.name?.en || 'Unknown', // ✅ استخراج `category` كـ string
                            subcategory: row.subcategory?.name?.en || 'Unknown',
                          }}
                          selected={selected.includes(String(row.id || ''))}
                          onSelectRow={() => row.id && onSelectRow(String(row.id))}
                          onDeleteRow={() => row.id && handleDeleteRow(String(row.id))}
                          onEditRow={() => handleEditRow(row.id!)} // ✅ تمرير الـ _id
                          onViewRow={() => row.id && handleViewRow(String(row.id))}
                        />

                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                      )
                    )}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  /> */}

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={data?.totalProducts || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)} // تحديث الصفحة
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 5));
              setPage(0); // إعادة الصفحة إلى 0 عند تغيير عدد الصفوف لكل صفحة
            }}
            dense={dense}
            onChangeDense={onChangeDense}
          />

        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
}: {
  inputData: Product[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string[];
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (product) => product.name?.en?.toLowerCase().includes(filterName.toLowerCase()) ?? false
    );
  }


  if (filterStatus.length) {
    inputData = inputData.filter((product) =>
      filterStatus.includes(product.inventoryType ?? '')
    );
  }


  return inputData;
}
