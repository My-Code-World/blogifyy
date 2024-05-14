require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;
mongoose.set('strictQuery', true);
app.use((req, res, next) => {
  res.setHeader('Keep-Alive', 'timeout=120, max=1000');
  next();
});


mongoose
  .connect("mongodb://127.0.0.1:27017/blogify",{useNewUrlParser: true, useUnifiedTopology: true})
  .then((e) => console.log("MongoDB Connected"));
console.log(process.env.MONGO_URL);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, '0.0.0.0', () => console.log(`Server Started at PORT:${PORT}`));
