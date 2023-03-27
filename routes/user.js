const express = require("express");
const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const router = express.Router();

router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: "Pic can not be updated" });
      }
      res.json(result);
    }
  );
});

router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id name email pic")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/top-creators", (req, res) => {
  User.find()
    .sort("-followers")
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
