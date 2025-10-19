# Menu Management Backend

A Node.js backend API for managing menu items, organized into categories and subcategories.

## Features

- **Categories**: Create, read, update categories with tax information
- **Subcategories**: Create subcategories under categories with inherited tax settings
- **Items**: Create items under categories or subcategories with pricing and tax calculations
- **Search**: Search items by name
- **RESTful API**: Full CRUD operations for all entities

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/menuManagement
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
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

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with MongoDB URI
4. Run locally: `npm start` or `npm run dev`

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: 3000 (optional, Vercel sets automatically)
4. Deploy

## Testing with Postman

Use the base URL: `http://localhost:3000` for local or your Vercel URL for production.

### Sample API Calls

**Create Category:**
```
POST /api/categories
{
  "name": "Beverages",
  "image": "https://example.com/beverages.jpg",
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
  "image": "https://example.com/hotdrinks.jpg",
  "description": "Coffee and tea",
  "categoryId": "category_id_here"
}
```

**Create Item:**
```
POST /api/items
{
  "name": "Coffee",
  "image": "https://example.com/coffee.jpg",
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
I chose MongoDB because it's a NoSQL database that works well with Node.js and provides flexible schema design for menu items with varying attributes.

**3 things that you learned from this assignment?**
1. Building RESTful APIs with proper validation and error handling
2. Working with Mongoose for MongoDB schema design and relationships
3. Implementing hierarchical data structures (Category -> Subcategory -> Item)

**What was the most difficult part of the assignment?**
Setting up the proper relationships between categories, subcategories, and items, especially handling the inheritance of tax settings from categories to subcategories.

**What you would have done differently given more time?**
- Add authentication and authorization
- Implement pagination for large datasets
- Add comprehensive input validation with libraries like Joi
- Create unit tests with Jest
- Add API documentation with Swagger
- Implement caching for better performance
- Add logging middleware for better debugging