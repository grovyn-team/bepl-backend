import mongoose from 'mongoose';
import Admin from '../models/Admin.model.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bepl');
    console.log('✅ Connected to MongoDB');

    // Get admin details
    const username = await question('Username: ');
    const email = await question('Email: ');
    const password = await question('Password: ');
    const role = await question('Role (admin/superadmin) [default: admin]: ') || 'admin';

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }]
    });

    if (existingAdmin) {
      console.log('❌ Admin with this username or email already exists');
      process.exit(1);
    }

    // Create admin
    const admin = new Admin({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role
    });

    await admin.save();
    console.log('✅ Admin created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();

