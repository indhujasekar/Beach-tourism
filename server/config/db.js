const mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('\n❌ MongoDB connection failed:', err.message);
    console.error('\n💡 How to fix this:');
    console.error('   1. In your MongoDB Atlas tab, click "Connect" -> "Drivers".');
    console.error('   2. Copy your connection string: mongodb+srv://<username>:<password>@cluster0.../beach_tourism');
    console.error('   3. Paste it into server/.env for MONGO_URI.');
    console.error('   4. In Atlas > "Network Access", ensure IP 0.0.0.0/0 (Allow from anywhere) is enabled.\n');
    process.exit(1);
  }
};
