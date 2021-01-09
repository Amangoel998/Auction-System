const mongoose = require('mongoose');
const config = require('config');
const dbURI = config.get('mongoURI');
const Auction = require('../models/Auction');
const Bidder = require('../models/Bidder');

// mongoose.connect(db);

//New Standard, Looks Synchronous
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected....');s
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
