//import mongoose
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

//db connection
mongoose
  .connect("mongodb://localhost:27017/movie_app")
  .then(() => {
    console.log("DB is connected");
  })
  .catch((e) => {
    console.log("DB connection failed:", e);
  });
