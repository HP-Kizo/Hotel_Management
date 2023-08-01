const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: [String], 
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  title: String,
  rooms: [String],
  cheapestPrice: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Hotel", hotelSchema);
