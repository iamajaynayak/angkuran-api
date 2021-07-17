const mongoose = require("mongoose");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 4,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  hashed_password: {
    type: String,
    minlength: 6,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
  varified: {
    type: Boolean,
    default: false,
  },
});

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password; // password
    this.salt = uuidv4(); // salt
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  // Authenticate method
  authenticate: function (plaintext) {
    return this.encryptPassword(plaintext) === this.hashed_password;
  },

  // Encryption method
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
