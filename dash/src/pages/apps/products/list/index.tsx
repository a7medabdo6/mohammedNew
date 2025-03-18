import { useState, useEffect } from 'react'
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Utils Import
import { getAllProducts, ProductData } from 'src/services/products'

// ** Custom Components
import TableHeader from 'src/views/apps/products/list/TableHeader'

type CellType = {
  row: {
    _id: string;
    name: { ar: string; en: string };
    price: number;
    category?: { name: { ar: string; en: string } };
    subcategory?: { name: { ar: string; en: string } };
  };
};

const InvoiceList = () => {
  // ** State for products
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ** Other states
  const [value, setValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (err) {
        setError('فشل في تحميل المنتجات')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const columns: GridColDef[] = [
    {
      field: 'name_en',
      headerName: 'Product Name (EN)',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => row.name.en
    },
    {
      field: 'name_ar',
      headerName: 'اسم المنتج (AR)',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }) => row.name.ar
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 0.5,
      minWidth: 120,
      renderCell: ({ row }) => `\$${row.price}`
    },
    {
      field: 'category',
      headerName: 'Category',
      flex: 0.7,
      minWidth: 150,
      renderCell: ({ row }) => row.category?.name?.en || 'N/A'
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      flex: 0.7,
      minWidth: 150,
      renderCell: ({ row }) => row.subcategory?.name?.en || 'N/A'
    },
    {
      flex: 0.5,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* زر حذف المنتج */}
          <Tooltip title='Delete Product'>
            <IconButton
              size='small'
              sx={{ color: 'error.main' }}
            >
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>

          {/* زر تعديل المنتج */}
          <Tooltip title='Edit'>
            <IconButton size='small' component={Link} href={`/apps/products/edit/${row._id}`}>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading) return <Typography>جاري التحميل...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={products}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
            getRowId={(row) => row._id}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default InvoiceList
