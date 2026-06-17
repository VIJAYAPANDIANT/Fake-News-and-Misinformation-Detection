const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Import Models
const User = require('../models/User');
const Prediction = require('../models/Prediction');
const Feedback = require('../models/Feedback');
const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fake_news_db';

const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected successfully.');

    // 1. Clear Collections
    console.log('Clearing existing database entries...');
    await User.deleteMany();
    await Prediction.deleteMany();
    await Feedback.deleteMany();
    await Report.deleteMany();
    await AdminLog.deleteMany();
    console.log('Collections cleared.');

    // 2. Seed Users
    console.log('Seeding Users...');
    // Note: User.pre('save') handles password hashing automatically
    const adminUser = await User.create({
      name: 'Alice Admin',
      email: 'admin@fakenewsservice.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    const standardUser1 = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'userpassword123',
      role: 'user',
    });

    const standardUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@yahoo.com',
      password: 'userpassword456',
      role: 'user',
    });

    console.log(`Seeded ${User.length} users successfully (1 admin, 2 standard users).`);

    // 3. Seed Predictions
    console.log('Seeding Predictions...');
    const pred1 = await Prediction.create({
      userId: standardUser1._id,
      title: 'Economy Reform Act',
      newsText: 'The government spokesman officially announced new business funding packages today.',
      prediction: 'Real',
      confidenceScore: 0.8950,
    });

    const pred2 = await Prediction.create({
      userId: standardUser1._id,
      title: 'Aliens and Banking',
      newsText: 'Leaked evidence reveals that central bank chiefs are controlled by secret alien groups.',
      prediction: 'Fake',
      confidenceScore: 0.9982,
    });

    const pred3 = await Prediction.create({
      userId: standardUser2._id,
      title: 'Water Cure Secrets',
      newsText: 'Big pharma is hiding how this miracle ionized water clears all cancers overnight.',
      prediction: 'Fake',
      confidenceScore: 0.9760,
    });

    console.log('Seeded 3 predictions successfully.');

    // 4. Seed Feedback
    console.log('Seeding Feedback...');
    await Feedback.create({
      userId: standardUser1._id,
      predictionId: pred1._id,
      feedback: 'This prediction is highly accurate! It was indeed an official statement.',
    });

    await Feedback.create({
      userId: standardUser2._id,
      predictionId: pred3._id,
      feedback: 'Accurate classification, definitely fake and misleading text.',
    });

    console.log('Seeded 2 feedbacks successfully.');

    // 5. Seed Reports
    console.log('Seeding Reports...');
    await Report.create({
      title: 'ML Prediction speed issue',
      description: 'The server takes about 3 seconds to retrieve predictions when under load.',
      status: 'pending',
    });

    await Report.create({
      title: 'Model prediction accuracy critique',
      description: 'An official-looking satire piece got classified as real news. Satire filter needed.',
      status: 'reviewed',
    });

    console.log('Seeded 2 reports successfully.');

    // 6. Seed AdminLogs
    console.log('Seeding Admin Logs...');
    await AdminLog.create({
      adminId: adminUser._id,
      action: 'Cleared predictions older than 30 days',
    });

    await AdminLog.create({
      adminId: adminUser._id,
      action: 'Updated model threshold confidence score to 0.75',
    });

    console.log('Seeded 2 admin logs successfully.');

    console.log('\n================ SEEDING COMPLETE ================');
    console.log('Successfully set up Users, Predictions, Feedback, Reports, and AdminLogs.');
    console.log('====================================================\n');
  } catch (err) {
    console.error(`Error seeding database: ${err.message}`);
  } finally {
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
};

seedDatabase();
