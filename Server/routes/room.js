const path = require("path");
const express = require("express");
const roomController = require("../controllers/room");
const middlewareController = require("../controllers/middleware");

const router = express.Router();

router.post("/postRoom", roomController.postRoom);

router.put("/updateRoomAvailability", roomController.updateRoomAvailability);

router.post(
  "/admin/add-room",
  middlewareController.middleware,
  roomController.adminAddRoom
);

router.get(
  "/admin/get-room/:id",
  middlewareController.middleware,
  roomController.adminGetRoom
);

router.get(
  "/admin/get-rooms",
  middlewareController.middleware,
  roomController.adminGetAllRoom
);

router.put(
  "/admin/update-room/:id",
  middlewareController.middleware,
  roomController.adminUpdateRoom
);

router.put(
  "/admin/delete-room/:id",
  middlewareController.middleware,
  roomController.adminDeleteRoom
);

module.exports = router;
