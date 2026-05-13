const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with active noise cancellation. Features 30-hour battery life, comfortable ear cushions, and crystal clear sound quality. Perfect for music lovers and professionals.",
    price: 99.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
    ],
    stock: 50,
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0",
      "Comfortable ear cushions",
      "Built-in microphone"
    ],
    specifications: {
      "Brand": "AudioPro",
      "Model": "AP-1000",
      "Color": "Black",
      "Connectivity": "Wireless",
      "Battery Life": "30 hours"
    }
  },
  {
    name: "Smart Watch Series 5",
    description: "Feature-packed smartwatch with heart rate monitor, GPS, and fitness tracking. Stay connected with notifications and calls directly on your wrist.",
    price: 199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400"
    ],
    stock: 30,
    features: [
      "Heart rate monitor",
      "GPS tracking",
      "Water resistant",
      "Fitness tracking",
      "Notification alerts"
    ],
    specifications: {
      "Brand": "TechFit",
      "Display": "1.4 inch AMOLED",
      "Battery": "5 days",
      "Compatibility": "iOS & Android"
    }
  },
  {
    name: "Premium Cotton T-Shirt",
    description: "Comfortable 100% organic cotton t-shirt. Breathable fabric perfect for everyday wear. Available in multiple sizes and colors.",
    price: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400"
    ],
    stock: 100,
    features: [
      "100% Organic Cotton",
      "Breathable fabric",
      "Machine washable",
      "Eco-friendly",
      "Available in 5 colors"
    ],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Sizes": "S, M, L, XL, XXL",
      "Care": "Machine wash cold"
    }
  },
  {
    name: "Leather Backpack",
    description: "Stylish and durable genuine leather backpack. Perfect for daily commute or travel. Multiple compartments for organized storage.",
    price: 79.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=400"
    ],
    stock: 45,
    features: [
      "Genuine leather",
      "Laptop compartment",
      "Adjustable straps",
      "Water resistant",
      "Multiple pockets"
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Capacity": "20L",
      "Laptop Size": "Up to 15.6 inch",
      "Weight": "1.2 kg"
    }
  },
  {
    name: "Coffee Maker Pro",
    description: "Programmable coffee maker with thermal carafe. Brew up to 12 cups with customizable strength settings. Keep coffee hot for hours.",
    price: 89.99,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"
    ],
    stock: 25,
    features: [
      "Programmable timer",
      "Thermal carafe",
      "Brew strength control",
      "Auto shut-off",
      "12-cup capacity"
    ],
    specifications: {
      "Brand": "BrewMaster",
      "Capacity": "12 cups",
      "Material": "Stainless Steel",
      "Wattage": "1100W"
    }
  },
  {
    name: "Yoga Mat Premium",
    description: "Eco-friendly non-slip yoga mat with carrying strap. Perfect for yoga, pilates, and floor exercises. 6mm thickness for comfort.",
    price: 39.99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400",
    images: [
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400"
    ],
    stock: 75,
    features: [
      "Non-slip surface",
      "Eco-friendly material",
      "Carrying strap included",
      "6mm thickness",
      "Easy to clean"
    ],
    specifications: {
      "Material": "TPE",
      "Dimensions": "72x24 inches",
      "Thickness": "6mm",
      "Weight": "1.2 kg"
    }
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Database seeded with', products.length, 'products');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });