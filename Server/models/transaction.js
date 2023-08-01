const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  hotel: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Hotel",
  },
  room: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Room",
      },
      number: {
        type: Number,
      },
    },
  ],
  dateStart: {
    type: Number,
    required: true,
  },
  dateEnd: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  info: {
    type: Object,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
