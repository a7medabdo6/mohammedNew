import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, Container, Typography, Grid, Divider, Button } from '@mui/material';
import { fetchOrderById } from 'src/services/orders'; // You'll need a service to fetch order details
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { PATH_DASHBOARD } from 'src/routes/paths';

OrderDetailsPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const loadOrderDetails = async () => {
        try {
          const fetchedOrder = await fetchOrderById(id as string); // Fetch order details by ID
          setOrder(fetchedOrder);
        } catch (error) {
          console.error('Error fetching order details:', error);
        } finally {
          setLoading(false);
        }
      };

      loadOrderDetails();
    }
  }, [id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (!order) {
    return <Typography variant="h6">Order not found.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Order Details
      </Typography>

      <Card sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">User Information</Typography>
            <Divider />
            <Typography>Email: {order.user.email}</Typography>
            <Typography>Address: {order.address}</Typography>
            <Typography>Payment Method: {order.paymentMethod}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Order Information</Typography>
            <Divider />
            <Typography>Status: {order.status}</Typography>
            <Typography>Total Amount: ${order.totalAmount}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Order Items</Typography>
        <Grid container spacing={2}>
          {order.items.map((item) => (
            <Grid item xs={12} md={6} key={item.product._id}>
              <Card sx={{ padding: 2 }}>
                <Typography variant="body1">Product: {item.product.name}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                <Typography variant="body2">Price: ${item.product.price}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Button variant="contained" color="primary" onClick={() => router.push(PATH_DASHBOARD.orders.root)}>
          Back to Orders List
        </Button>
      </Card>
    </Container>
  );
}
