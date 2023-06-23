const mongoose = require("mongoose");

const connectDB = async () => {
  const url = process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(
      "mongodb+srv://angelsoto2373:JoCZ3pOc8ioUtpyj@cluster4.tjsl0zh.mongodb.net/?retryWrites=true&w=majority" || {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit();
  }
};

module.exports = connectDB;
