const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middlewares/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/auth`, require('./src/routes/authRoutes'));
app.use(`${apiPrefix}/companies`, require('./src/routes/companyRoutes'));
app.use(`${apiPrefix}/roles`, require('./src/routes/roleRoutes'));
app.use(`${apiPrefix}/users`, require('./src/routes/userRoutes'));
app.use(`${apiPrefix}/locations`, require('./src/routes/locationRoutes'));
app.use(`${apiPrefix}/products`, require('./src/routes/productRoutes'));
app.use(`${apiPrefix}/inventory`, require('./src/routes/inventoryRoutes'));
app.use(`${apiPrefix}/orders`, require('./src/routes/orderRoutes'));
app.use(`${apiPrefix}/shipments`, require('./src/routes/shipmentRoutes'));
app.use(`${apiPrefix}/coupons`, require('./src/routes/couponRoutes'));
app.use(`${apiPrefix}/alerts`, require('./src/routes/alertRoutes'));
app.use(`${apiPrefix}/analytics`, require('./src/routes/analyticsRoutes'));
app.use(`${apiPrefix}/ai`, require('./src/routes/aiRoutes'));
app.use(`${apiPrefix}/buyer`, require('./src/routes/buyerRoutes'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('Supply Chain API v1 is running...');
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});