const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String },
  price: { type: Number, required: true },
  maxPeople: { type: Number, required: true },
  desc: { type: String, required: true },
  roomNumbers: [{ number: Number, unavailabelDate: [{ type: Number }] }],
  type: { type: String, default: "twin" },
});

module.exports = mongoose.model("Room", roomSchema);
