const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

/* UserModel Schema */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "CS", "PROVIDER", "USER"],
    default: "USER"
  },
  profileImage: {
    type: String,
    required: false
  },
  bornDate: {
    type: Date,
    required: false
  },
  sex: {
    type: String,
    enum: ["MALE", "FEMALE", "OTHER"],
    required: true
  },
  bio: {
    type: String,
    required: false
  }
});

/*Generated Token*/
userSchema.methods.generateAuthToken = function() {
    let token = jwt.sign(
        { _id: this._id, username: this.username, role: this.role },
        config.get("jwtPrivateKey"),
        {
            expiresIn: 86400
        }
    );
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    username: Joi.string()
      .min(6)
      .max(20)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    profileImage: Joi.string(),
    bornDate: Joi.date(),
    bio: Joi.string(),
    sex: Joi.string()
      .valid(["MALE", "FEMALE", "OTHER"])
      .required()
  };
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;