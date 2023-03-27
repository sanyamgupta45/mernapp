const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

const router = express.Router();

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please Add all the fields !!" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        res.status(422).json({ error: "User already Exists" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
          pic,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "User Saved Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please Enter both Email and Password" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      res.status(422).json({ error: "User Doesn't Exist with this email ID" });
    } else {
      bcrypt
        .compare(password, savedUser.password)
        .then((didMatch) => {
          if (didMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            res.status(422).json({ error: "Invalid Password" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

module.exports = router;
