const express = require("express");
const app = express();
const errorMidddleWare = require("./middleWare/error");

app.use(express.json());

// For Server Testing
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Successful" });
});
//Routes
const product = require("./routes/productRoute");

app.use("/api/v1", product);

// Middlewere for Error
app.use(errorMidddleWare);

module.exports = app;
