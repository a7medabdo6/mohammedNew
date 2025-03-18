const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');

const productRoutes = require('./src/routes/productRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const cartRoutes = require('./src/routes/CartRoutes');
const favRoutes = require('./src/routes/FavoriteRoutes');
const siteInfoRoutes = require('./src/routes/siteInfoRoutes');

const orderRoutes = require('./src/routes/OrderRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // دعم البيانات المرسلة من النماذج

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/fav', favRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/site-info', siteInfoRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));