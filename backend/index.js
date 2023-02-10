const express = require("express");
const userRouter = require("./routes/user");
const mongoose = require("mongoose")

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);

app.listen(8000, () => {
  console.log("The app is running on port 8000");
});
