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

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user (Admin)

### Inventory
- `GET /api/inventory?locationId=...` - Get inventory
- `POST /api/inventory/update` - Update stock (production/transfer)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `PUT /api/orders/:id/status` - Update status (ship/deliver)

### AI
- `POST /api/ai/forecast` - Get demand forecast
- `GET /api/ai/recommendations?locationId=...` - Get stock recommendations

## Project Structure
- `src/models`: Database schemas
- `src/controllers`: Request handlers
- `src/services`: Business logic (Inventory reservation, AI calls)
- `src/routes`: API definitions
- `src/middlewares`: Auth and Error handling
