const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/menuManagement', {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  family: 4,
  retryWrites: true,
  retryReads: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/subcategories', require('./routes/subcategoryRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// Seed endpoint (temporary - remove after use)
app.get('/api/seed', async (req, res) => {
  try {
    const Category = require('./models/Category');
    const Subcategory = require('./models/Subcategory');
    const Item = require('./models/Item');

    // Clear existing data
    await Category.deleteMany({});
    await Subcategory.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    // Create Categories
    const beveragesCategory = await Category.create({
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
      description: 'Refreshing drinks and beverages',
      taxApplicability: true,
      tax: 5,
      taxType: 'GST'
    });

    const foodCategory = await Category.create({
      name: 'Food',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      description: 'Delicious food items',
      taxApplicability: true,
      tax: 12,
      taxType: 'GST'
    });

    console.log('Created categories');

    // Create Subcategories
    const hotDrinksSub = await Subcategory.create({
      name: 'Hot Drinks',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      description: 'Coffee, tea, and hot beverages',
      category: beveragesCategory._id
    });

    const coldDrinksSub = await Subcategory.create({
      name: 'Cold Drinks',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
      description: 'Cold beverages and juices',
      category: beveragesCategory._id
    });

    const mainCourseSub = await Subcategory.create({
      name: 'Main Course',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      description: 'Main dishes and entrees',
      category: foodCategory._id
    });

    console.log('Created subcategories');

    // Create Items
    await Item.create([
      {
        name: 'Coffee',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
        description: 'Freshly brewed coffee',
        taxApplicability: true,
        tax: 5,
        baseAmount: 50,
        discount: 5,
        category: beveragesCategory._id,
        subcategory: hotDrinksSub._id
      },
      {
        name: 'Tea',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
        description: 'Traditional tea varieties',
        taxApplicability: true,
        tax: 5,
        baseAmount: 30,
        discount: 0,
        category: beveragesCategory._id,
        subcategory: hotDrinksSub._id
      },
      {
        name: 'Cola',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
        description: 'Refreshing cola drink',
        taxApplicability: true,
        tax: 5,
        baseAmount: 40,
        discount: 0,
        category: beveragesCategory._id,
        subcategory: coldDrinksSub._id
      },
      {
        name: 'Orange Juice',
        image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
        description: 'Fresh orange juice',
        taxApplicability: true,
        tax: 5,
        baseAmount: 60,
        discount: 10,
        category: beveragesCategory._id,
        subcategory: coldDrinksSub._id
      },
      {
        name: 'Chicken Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        description: 'Juicy chicken burger with fries',
        taxApplicability: true,
        tax: 12,
        baseAmount: 150,
        discount: 20,
        category: foodCategory._id,
        subcategory: mainCourseSub._id
      },
      {
        name: 'Pizza Margherita',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        description: 'Classic margherita pizza',
        taxApplicability: true,
        tax: 12,
        baseAmount: 200,
        discount: 25,
        category: foodCategory._id,
        subcategory: mainCourseSub._id
      }
    ]);

    console.log('Created sample items');

    res.json({
      message: 'Database seeded successfully!',
      data: {
        categories: 2,
        subcategories: 3,
        items: 6
      }
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Menu Management Backend API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;