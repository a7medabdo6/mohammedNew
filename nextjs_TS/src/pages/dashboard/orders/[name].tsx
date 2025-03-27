import { useRouter } from 'next/router';
import { useState, useEffect, ReactElement } from 'react';
import { Card, Container, Typography, Grid, Divider, Button, CircularProgress, Paper } from '@mui/material';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { fetchOrderById } from 'src/services/orders';

interface User {
  _id: string;
  email: string;
}

interface Product {
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  _id: string;
  price: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  address: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

const OrderDetailsPage = (): ReactElement => {
  const router = useRouter();
  const { name } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    if (name) {
      const loadOrderDetails = async () => {
        try {
          const fetchedOrder = await fetchOrderById(name as string);
          if (fetchedOrder) {
            setOrder(fetchedOrder);
          } else {
            setOrder(null);
          }
        } catch (error) {
          console.error('Error fetching order details:', error);
          setOrder(null);
        } finally {
          setLoading(false);
        }
      };
  
      loadOrderDetails();
    }
  }, [name]);
  

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!order) {
    return <Typography variant="h6">لم يتم العثور على الطلب.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          تفاصيل الطلب
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="secondary">معلومات المستخدم</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>البريد الإلكتروني:</strong> {order.user.email}</Typography>
            <Typography><strong>العنوان:</strong> {order.address}</Typography>
            <Typography><strong>طريقة الدفع:</strong> {order.paymentMethod === 'cash_on_delivery' ? 'الدفع عند الاستلام' : order.paymentMethod}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" color="secondary">معلومات الطلب</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography><strong>الحالة:</strong> {order.status}</Typography>
            <Typography><strong>المبلغ الإجمالي:</strong> ${order.totalAmount}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" color="secondary">العناصر في الطلب</Typography>
        <Grid container spacing={2}>
          {order.items.map((item) => (
            <Grid item xs={12} md={6} key={item._id}>
              <Card sx={{ padding: 2, boxShadow: 2, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="body1"><strong>المنتج:</strong> {item.product.name[language]}</Typography>
                <Typography variant="body2" dangerouslySetInnerHTML={{ __html: item.product.description[language] }} />
                <Typography variant="body2"><strong>الكمية:</strong> {item.quantity}</Typography>
                <Typography variant="body2"><strong>السعر:</strong> ${item.product.price}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Button variant="contained" color="primary" sx={{ display: 'block', mx: 'auto', mt: 2 }} onClick={() => router.push(PATH_DASHBOARD.orders.list)}>
          العودة إلى قائمة الطلبات
        </Button>
      </Paper>
    </Container>
  );
};

OrderDetailsPage.getLayout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default OrderDetailsPage;