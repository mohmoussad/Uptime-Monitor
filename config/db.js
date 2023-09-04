const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

const dbConnect = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB is Ready");
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
  }
};

module.exports = dbConnect;
