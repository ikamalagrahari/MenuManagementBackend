# Menu Management System

A full-stack web application for managing restaurant menu items, organized into categories and subcategories. Features both a REST API backend and a modern React frontend interface.

## Features

### Backend API
- **Categories**: Create, read, update categories with tax information
- **Subcategories**: Create subcategories under categories with inherited tax settings
- **Items**: Create items under categories or subcategories with pricing and tax calculations
- **Search**: Search items by name with real-time results
- **RESTful API**: Full CRUD operations for all entities
- **MongoDB Atlas**: Cloud-hosted database with automatic scaling

### Frontend Interface
- **Modern React UI**: Beautiful, responsive interface built with React
- **Real-time Search**: Instant search functionality across menu items
- **Interactive Forms**: Create new categories, subcategories, and items
- **Tabbed Navigation**: Organized views for different data types
- **Mobile Responsive**: Works perfectly on all device sizes
- **Live API Integration**: Connected to production backend

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas** with **Mongoose** ODM
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

### Frontend
- **React** with modern hooks
- **Axios** for API communication
- **CSS3** with responsive design
- **Create React App** for development

## Project Structure

```
MenuManagementSystem/
├── backend/                    # Node.js API server
│   ├── models/                # MongoDB schemas
│   │   ├── Category.js
│   │   ├── Subcategory.js
│   │   └── Item.js
│   ├── routes/                # API route handlers
│   │   ├── categoryRoutes.js
│   │   ├── subcategoryRoutes.js
│   │   └── itemRoutes.js
│   ├── middleware/            # Custom middleware
│   │   └── validation.js
│   ├── server.js              # Main server file
│   ├── seed.js                # Database seeder
│   ├── vercel.json            # Vercel deployment config
│   └── package.json
├── frontend/                  # React application
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styling
│   │   └── index.js
│   ├── public/               # Static assets
│   └── package.json
├── .gitignore
├── README.md                 # This file
└── package.json             # Root package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/ikamalagrahari/MenuManagementBackend.git
   cd MenuManagementBackend
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   - Copy `.env` file to `backend/` directory
   - Update MongoDB URI in `backend/.env`:
     ```
     MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/menuManagement
     PORT=3000
     ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

### Running the Application

**Development Mode:**
```bash
# Terminal 1: Start Backend
npm run dev-backend

# Terminal 2: Start Frontend
npm run start-frontend
```

**Production Mode:**
```bash
# Backend
npm run start-backend

# Frontend (after building)
npm run build-frontend
npm run start-frontend
```

## API Endpoints

### Categories
- `POST /api/categories` - Create category
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:name` - Get category by name
- `PUT /api/categories/:id` - Update category

### Subcategories
- `POST /api/subcategories` - Create subcategory under category
- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/category/:categoryId` - Get subcategories under category
- `GET /api/subcategories/:id` - Get subcategory by ID
- `GET /api/subcategories/:name` - Get subcategory by name
- `PUT /api/subcategories/:id` - Update subcategory

### Items
- `POST /api/items` - Create item under category/subcategory
- `GET /api/items` - Get all items
- `GET /api/items/category/:categoryId` - Get items under category
- `GET /api/items/subcategory/:subcategoryId` - Get items under subcategory
- `GET /api/items/:id` - Get item by ID
- `GET /api/items/:name` - Get item by name
- `PUT /api/items/:id` - Update item
- `GET /api/items/search/:name` - Search items by name

## Database Schema

### Category
- name (String, required, unique)
- image (String, URL, required)
- description (String, required)
- taxApplicability (Boolean, required)
- tax (Number, required if taxApplicability true)
- taxType (String, required if taxApplicability true)

### Subcategory
- name (String, required)
- image (String, URL, required)
- description (String, required)
- taxApplicability (Boolean, defaults to category's)
- tax (Number, defaults to category's)
- category (ObjectId, reference to Category, required)

### Item
- name (String, required)
- image (String, URL, required)
- description (String, required)
- taxApplicability (Boolean, required)
- tax (Number, required if taxApplicability true)
- baseAmount (Number, required)
- discount (Number, default 0)
- totalAmount (Number, calculated as baseAmount - discount)
- category (ObjectId, reference to Category, required)
- subcategory (ObjectId, reference to Subcategory, optional)

## Deployment

### Backend (API)
- **Live API**: https://menu-management-backend-one.vercel.app
- **GitHub**: https://github.com/ikamalagrahari/MenuManagementBackend

### Frontend (React App)
- **Live Frontend**: [Deployed on Vercel - URL will be provided after deployment]
- **Features**: Complete menu management interface with search, create, and view functionality

### Local Development
1. Clone the repository
2. Install backend dependencies: `npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Create `.env` file with MongoDB URI
5. Run backend: `npm start`
6. Run frontend: `cd frontend && npm start`

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Leave as default
4. Deploy both backend and frontend

## Testing with Postman

Use the base URL: `http://localhost:3000` for local or your Vercel URL for production.

### Sample API Calls

**Create Category:**
```
POST /api/categories
{
  "name": "Beverages",
  "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
  "description": "Drinks and beverages",
  "taxApplicability": true,
  "tax": 5,
  "taxType": "GST"
}
```

**Create Subcategory:**
```
POST /api/subcategories
{
  "name": "Hot Drinks",
  "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
  "description": "Coffee and tea",
  "categoryId": "category_id_here"
}
```

**Create Item:**
```
POST /api/items
{
  "name": "Coffee",
  "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
  "description": "Hot coffee",
  "taxApplicability": true,
  "tax": 5,
  "baseAmount": 50,
  "discount": 5,
  "categoryId": "category_id_here",
  "subcategoryId": "subcategory_id_here"
}
```

**Search Items:**
```
GET /api/items/search/Coffee
```

## Questions & Answers

**Which database you have chosen and why?**
I chose MongoDB Atlas because it's a NoSQL database that provides flexible schema design for menu items with varying attributes. It's also cloud-hosted, scalable, and works well with Node.js applications deployed on serverless platforms like Vercel.

**3 things that you learned from this assignment?**
1. Building RESTful APIs with proper validation and error handling using Express.js
2. Working with Mongoose ODM for MongoDB schema design and managing relationships between collections
3. Implementing hierarchical data structures and understanding the challenges of serverless deployment with database connections

**What was the most difficult part of the assignment?**
Setting up the MongoDB connection for Vercel deployment was the most challenging. Serverless functions have strict timeout limits and connection pooling requirements that differ from traditional server deployments. Configuring the connection options and handling the buffering timeout issues required multiple iterations.

**What you would have done differently given more time?**
- Implement comprehensive input validation with libraries like Joi
- Add pagination for large datasets and implement caching for better performance
- Create unit tests with Jest and integration tests
- Add API documentation with Swagger/OpenAPI
- Implement rate limiting and request logging middleware
- Add image upload functionality instead of just URLs
- Create a frontend interface to demonstrate the API

## Questions & Answers

**Which database you have chosen and why?**
I chose MongoDB because it's a NoSQL database that works well with Node.js and provides flexible schema design for menu items with varying attributes.

**3 things that you learned from this assignment?**
1. Building RESTful APIs with proper validation and error handling
2. Working with Mongoose for MongoDB schema design and relationships
3. Implementing hierarchical data structures (Category -> Subcategory -> Item)

**What was the most difficult part of the assignment?**
Setting up the proper relationships between categories, subcategories, and items, especially handling the inheritance of tax settings from categories to subcategories.

**What you would have done differently given more time?**
- Implement pagination for large datasets
- Add comprehensive input validation with libraries like Joi
- Create unit tests with Jest
- Add API documentation with Swagger
- Implement caching for better performance
- Add logging middleware for better debugging