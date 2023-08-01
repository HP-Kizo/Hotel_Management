const path = require("path");
const express = require("express");
const userController = require("../controllers/user");
const middleware = require("../controllers/middleware");

const router = express.Router();

router.post("/login", userController.postUserLogin);

router.post("/register", userController.postUserRegister);

router.get(
  "/admin/get-users",
  middleware.middleware,
  userController.adminGetUsers
);

router.get("/admin/login", middleware.checkAdmin, userController.getAdminLogin);

router.post("/admin/register", userController.adminRegister);

module.exports = router;
