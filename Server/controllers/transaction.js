const Transaction = require("../models/transaction");
const User = require("../models/user");
exports.postReserve = (req, res, next) => {
  const dataTransaction = req.body.data;
  console.log(dataTransaction);

  const transaction = new Transaction(dataTransaction);
  transaction
    .save()
    .then((savedTransaction) => {
      // Thực hiện các xử lý sau khi lưu thành công
      console.log("Transaction saved:", savedTransaction);
      res.status(200).json({ message: "OK" });
    })
    .catch((error) => {
      // Xử lý lỗi nếu có
      res.status(500).json({ error: "Error saving transaction" });
    });
};

exports.getTransaction = (req, res, next) => {
  return Transaction.find({ user: req.query._id })
    .populate("hotel")
    .then((result) => {
      if (result) {
        return res.status(200).json(result);
      } else {
        res.status(404).json({ error: "No hotels found" });
        console.log("Fail");
      }
    })
    .catch((err) => console.log(err));
};

exports.adminGetTransaction = (req, res, next) => {
  const limit = req.query.limit;
  return Transaction.find()
    .populate("user")
    .populate("hotel")
    .limit(limit)
    .then(async (result) => {
      const users = await User.find({ isAdmin: false });
      const transactions = await Transaction.find();

      if (result) {
        return res.status(200).json({
          data: result,
          countUser: users.length,
          countTransaction: transactions.length,
        });
      } else {
        res.status(404).json({ error: "No hotels found" });
        console.log("Fail");
      }
    })
    .catch((err) => console.log(err));
};
