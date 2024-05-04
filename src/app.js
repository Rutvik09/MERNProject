require("dotenv").config();
const express = require("express");
const app = express();
require("./db/conn");
const path = require("path");
const port = process.env.PORT || 3000;
app.use(express.json());
const hbs = require("hbs");
const Register = require("./models/register");
const staticpath = path.join(__dirname, "../public");
const temppath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const auth = require('../src/middleware/auth');
// app.use(express.static(staticpath))
app.set("view engine", "hbs");
app.set("views", temppath);
hbs.registerPartials(partialPath);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", async (req, res) => {
  res.render("index");
});

console.log("SECREAT",process.env.SECREAT)
app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const fullname = req.body.fullname;
    const user = await Register.findOne({ fullname: fullname });
    const isMatch = bcrypt.compare(req.body.password, user.password);
    console.log(isMatch, "password");
    const token = await user.generateAuthToken();
    console.log(token);
    res.cookie("jwt",token,{
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true
    })
    if (isMatch) {
      res.status(201).render("dummy");
    } else {
      res.status(400).send("invalid password");
    }
  } catch {
    res.status(400).send("invalid password");
  }
});

app.post("/register", async (req, res) => {
  const val = new Register(req.body);
  const token = await val.generateAuthToken();
  console.log(token);
  res.cookie("jwt",token,{
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  })
  console.log("cookie added",res.cookie);
  val
    .save()
    .then(() => {
      res.status(201).render("login");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/secret',auth,(req, res) => {


  res.render('secret')
})

app.get("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.render("index");
});

app.listen(port, () => {
  console.log("server is running on port ");
});
