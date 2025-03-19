import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TableHeader from 'src/views/apps/categories/list/TableHeader'
import { getCategories, deleteCategory } from 'src/services/categories'
import Icon from 'src/@core/components/icon'

type CategoryData = {
  _id: string
  name: string
  parent?: { _id: string; name: string }
  subcategories?: { _id: string; name: string }[]
}

const CategoryList = () => {
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [value, setValue] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError('فشل في تحميل الفئات')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // حذف الفئة
  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      try {
        await deleteCategory(id)
        setCategories(prev => prev.filter(category => category._id !== id))
        toast.success('تم حذف الفئة بنجاح')
      } catch (error) {
        toast.error('فشل في حذف الفئة')
      }
    }
  }

  // التوجه إلى صفحة التعديل
  const handleEdit = (id: string) => {
    router.push(`/apps/categories/edit/${id}`)
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Category Name', flex: 1, minWidth: 200, renderCell: ({ row }) => row.name },
    {
      field: 'parent',
      headerName: 'Parent Category',
      flex: 0.7,
      minWidth: 150,
      renderCell: ({ row }) => row.parent ? row.parent.name : 'N/A'
    },
    {
      field: 'subcategories',
      headerName: 'Subcategories',
      flex: 1,
      minWidth: 250,
      renderCell: ({ row }) => row.subcategories?.length
        ? row.subcategories.map((sub: { name: any }) => sub.name).join(', ')
        : 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 150,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row._id)} color="primary">
              <Icon icon="tabler:edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(row._id)} color="error">
              <Icon icon="tabler:trash" />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ]

  if (loading) return <Typography>جاري التحميل...</Typography>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader value={value} selectedRows={selectedRows} handleFilter={setValue} />
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={categories}
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
      <ToastContainer />
    </Grid>
  )
}

export default CategoryList
