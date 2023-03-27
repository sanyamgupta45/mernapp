const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default:null,
    },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String, //text: String is shorthand for text: {type: String}
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "User", // relation building in mongodb
  },
},{timestamps:true});

mongoose.model("Post", postSchema);
