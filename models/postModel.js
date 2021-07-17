const mongoose = require("mongoose");
const validator = require("validator");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [2, "title can not be empty"],
    maxlength: 180,
  },
  body: {
    type: String,
    required: true,
    minlength: 40,
    maxlength: 2000,
  },
  photo: {
    type: Buffer,
    contentType: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Posts", postSchema);
