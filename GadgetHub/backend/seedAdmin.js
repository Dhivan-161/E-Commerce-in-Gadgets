require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./moduls/user');

const ADMIN_EMAIL    = 'admin@gadgethub.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME     = 'Admin';

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log('✅ Connected to MongoDB');

    // Remove existing admin (clean re-seed)
    await User.deleteOne({ email: ADMIN_EMAIL });

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    await User.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hashedPassword,
      isAdmin:  true,
    });

    console.log('🎉 Admin user created!');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
