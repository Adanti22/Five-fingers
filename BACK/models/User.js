const { Schema, model } = require("mongoose");

const User = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  roles: [{ type: String, ref: "Role" }],
  age: { type: Number },
  //Conf:
  imgLink: { type: String },
  specialization: { type: Array },
  price: { type: Number },
  description: { type: String },
  experience: { type: Number },

});

module.exports = model("User", User);
