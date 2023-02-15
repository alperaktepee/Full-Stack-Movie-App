const express = require("express");

//import db
require("./db");

//Routers
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());

//Routes
app.use("/api/user", userRouter);

//I learned what is middleware 
app.post(
  "/sign-in",
  (req, res, next) => {
    const { email, password } = req.body;

    //Check if email or password is empty
    if (!email || !password) {
      return res.json({ error: "E-mail or password cannot be empty !" });
    }
    next();
  },
  (req, res) => {
    res.send("<h1>Hello I am about page</h1>");
  }
);

//Server listening
app.listen(8000, () => {
  console.log("The app is running on port 8000");
});
