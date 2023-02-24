const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/dataBase");
const cloudinary = require("cloudinary");

// Handling Uncatch Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Setting Down The Server Due to uncaught Exception Rejection.`);
  Promise.exit(1);
});

// Dot ENV files
dotenv.config({
  path: "config/config.env",
});

//Connecting with Server
connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, 
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
});

// Unhandeled Promiss Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Setting Down The Server Due to Unhandled Promis Rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
