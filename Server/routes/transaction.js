const path = require("path");
const express = require("express");
const transactionController = require("../controllers/transaction");
const middlewareController = require("../controllers/middleware");

const router = express.Router();

router.post("/postReserve", transactionController.postReserve);

router.get("/data", transactionController.getTransaction);

router.get(
  "/admin/getTransaction",
  middlewareController.middleware,
  transactionController.adminGetTransaction
);

module.exports = router;
