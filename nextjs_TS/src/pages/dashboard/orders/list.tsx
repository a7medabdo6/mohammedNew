import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Tab,
  Tabs,
  Card,
  Table,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
} from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
import DashboardLayout from '../../../layouts/dashboard';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../../components/table';
import { updateOrderStatus, fetchOrders ,deleteOrder} from 'src/services/orders';

// Define types
interface User {
  email: string;
}

interface Order {
  _id: string;
  user: User;
  totalAmount: number;
  status: string;
  address: string;
  paymentMethod: string;
}

const STATUS_OPTIONS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const TABLE_HEAD = [
  { id: 'user', label: 'User Email', align: 'left' },
  { id: 'totalAmount', label: 'Total Amount', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: 'paymentMethod', label: 'Payment Method', align: 'left' },
  { id: '' },
];

OrdersListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrdersListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders(filterStatus !== 'all' ? filterStatus : undefined);
      setOrders(data);
    };
    loadOrders();
  }, [filterStatus]);

  const handleFilterStatus = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    const success = await deleteOrder(orderId);
    if (success) {
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId)); // Update state to remove the deleted order
    } else {
      alert("An error occurred while deleting the order.");
    }
  };
  return (
    <>
      <Head>
        <title> Orders List | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Orders List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Orders', href: PATH_DASHBOARD.orders.root },
            { name: 'List' },
          ]}
        />

        <Card>
          <Tabs value={filterStatus} onChange={handleFilterStatus} sx={{ px: 2, bgcolor: 'background.neutral' }}>
            {STATUS_OPTIONS.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>

          <Divider />

          <TableContainer>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orders.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.user.email}</td>
                      <td>{order.totalAmount}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.slice(1).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{order.address}</td>
                      <td>{order.paymentMethod}</td>
                      <NextLink href={`/dashboard/orders/${order._id}`} passHref>
                          <IconButton color="primary">
                            <Iconify icon="eva:eye-fill" width={20} height={20} />
                          </IconButton>
                        </NextLink>
                      <td>
                        <IconButton onClick={() => handleDeleteOrder(order._id)} color="error">
                          <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                        </IconButton>
                      </td>
                    </tr>
                  ))}

                  <TableNoData isNotFound={!orders.length} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={orders.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
