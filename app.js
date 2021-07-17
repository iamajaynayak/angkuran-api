const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const postRoutes = require("./routes/postRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());

// DOTENV
dotenv.config();
//--------------------//

// Morgan - Middleware
app.use(morgan("dev"));

//Cookie-parser
app.use(cookieParser());

//cors
app.use(cors());

// post routes
app.use(postRoutes);

//auth routes
app.use(authRoutes);

//user routes
app.use(userRoutes);

//database connection
require("./db/connection");

app.get("/", (req, res) => {
  fs.readFile("docs/about.json", (err, data) => {
    if (err) {
      res.json(err.message);
    }
    const home = JSON.parse(data);
    res.json(home);
  });
});

app.use((err, req, res, next) => {
  const { status = 404, message = "Something went wrong" } = err;
  res.status(status).json({ error: message });
});

//port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server is online");
});
