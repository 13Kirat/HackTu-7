# Supply Chain Backend

Node.js Backend for Multi-Company Supply Chain Optimization System.

## Features
- **Multi-tenancy:** Supports multiple companies with isolated data.
- **Three Portals:** Admin, Dealer, Buyer support via Role-Based Access Control (RBAC).
- **Inventory Management:** Tracking stock levels, reservations, and movements.
- **Order Management:** Full order lifecycle from placement to delivery.
- **AI Integration:** Integration with Python/FastAPI service for demand forecasting (Mocked if unavailable).

## Tech Stack
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Axios (for AI service communication)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/supply_chain_db
   JWT_SECRET=your_jwt_secret_key
   AI_SERVICE_URL=http://localhost:8000
   ```

3. **Seed Database**
   Populate the database with initial Company, Roles, Users, and Products.
   ```bash
   node seed.js
   ```

4. **Run Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Endpoints (v1)

Base URL: `/api/v1`

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register User (Admin)
- `GET /auth/profile` - Get User Profile

### Company & Roles
- `POST /companies` - Create Company
- `GET /companies/:id` - Get Company
- `POST /roles` - Create Role
- `GET /roles` - List Roles

### Locations & Products
- `POST /locations` - Create Location
- `GET /locations` - List Locations
- `POST /products` - Create Product
- `GET /products` - List Products

### Inventory
- `POST /inventory` - Add Stock
- `GET /inventory/location/:id` - Get Location Stock
- `POST /inventory/transfer` - Transfer Stock
- `GET /inventory/movements` - Movement History

### Orders & Shipments
- `POST /orders/dealer` - Dealer Order
- `POST /orders/customer` - Customer Order
- `GET /orders` - List Orders
- `POST /shipments` - Create Shipment
- `PUT /shipments/:id/status` - Update Shipment Status

### AI & Analytics
- `POST /ai/forecast` - Trigger Demand Forecast
- `GET /ai/forecasts` - Get Forecast History
- `GET /analytics/sales` - Sales Summary
- `GET /analytics/imbalances` - Stock Imbalances

## Postman Collection
Import `postman_collection.json` into Postman to test the APIs.
Set the `token` variable in your environment after login.

