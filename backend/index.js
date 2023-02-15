const express = require("express");

//import db
require("./db");

//Routers
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());

//Routes
app.use("/api/user", userRouter);

//Server listening
app.listen(8000, () => {
  console.log("The app is running on port 8000");
});
