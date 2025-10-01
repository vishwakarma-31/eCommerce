const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ProductConcept = require('./models/Product');
const Category = require('./models/Category');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'Admin'
  },
  {
    name: 'Creator User',
    email: 'creator@example.com',
    password: '123456',
    role: 'Creator'
  },
  {
    name: 'Backer User',
    email: 'backer@example.com',
    password: '123456',
    role: 'Backer'
  }
];

const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Home & Garden', description: 'Home improvement and gardening products' },
  { name: 'Fashion', description: 'Clothing and accessories' },
  { name: 'Sports', description: 'Sports equipment and apparel' },
  { name: 'Books', description: 'Books and educational materials' }
];

const products = [
  {
    title: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring features',
    detailedDescription: 'The Smart Watch Pro offers comprehensive health tracking including heart rate, sleep quality, and activity monitoring. With a week-long battery life and water resistance up to 50m, it\'s perfect for active lifestyles.',
    price: 199.99,
    fundingGoal: 100,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    category: 'Electronics',
    tags: ['wearable', 'health', 'fitness', 'smartwatch'],
    status: 'Funding'
  },
  {
    title: 'Eco-Friendly Water Bottle',
    description: 'Sustainable water bottle made from recycled materials',
    detailedDescription: 'Stay hydrated while helping the environment with our eco-friendly water bottle. Made from 100% recycled materials, this bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 24.99,
    fundingGoal: 500,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    category: 'Home & Garden',
    tags: ['eco-friendly', 'sustainable', 'hydration', 'outdoor'],
    status: 'Funding'
  }
];

// Seed data
const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await ProductConcept.deleteMany();
    await Category.deleteMany();

    console.log('Existing data cleared...');

    // Insert users
    const createdUsers = await User.insertMany(users);
    const creatorUser = createdUsers.find(user => user.role === 'Creator');
    
    console.log('Users seeded...');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded...');

    // Insert products with creator reference
    const productsWithCreator = products.map(product => ({
      ...product,
      creator: creatorUser._id,
      slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));

    await ProductConcept.insertMany(productsWithCreator);
    console.log('Products seeded...');

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Remove data
const removeData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await ProductConcept.deleteMany();
    await Category.deleteMany();

    console.log('Data removed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  removeData();
} else {
  seedData();
}