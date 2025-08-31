import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Expense from './models/Expense.js';
import Goal from './models/Goal.js';

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Expense.deleteMany();
    await Goal.deleteMany();

    // Create a demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    const createdUsers = await User.insertMany([
      { name: "Demo User", email: "demo@example.com", password: hashedPassword }
    ]);
    
    const demoUserId = createdUsers[0]._id;
    console.log(`Demo user created with email: demo@example.com and password: 123456`);

    // Create sample data for the demo user
    const sampleExpenses = [
      { userId: demoUserId, amount: 350, note: "Zomato dinner order", category: "Food" },
      { userId: demoUserId, amount: 2200, note: "New clothes from Myntra", category: "Shopping" },
      { userId: demoUserId, amount: 180, note: "Uber ride home", category: "Travel" },
      { userId: demoUserId, amount: 950, note: "Phone recharge", category: "Bills" },
    ];
    
    const sampleGoals = [
      { userId: demoUserId, goalName: "Goa Trip", targetAmount: 50000, currentAmount: 12000, targetDate: new Date('2025-12-31') }
    ];

    await Expense.insertMany(sampleExpenses);
    await Goal.insertMany(sampleGoals);

    console.log('Sample data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();