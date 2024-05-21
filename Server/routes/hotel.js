const path = require("path");
const express = require("express");
const hotelController = require("../controllers/hotel");
const middlewareController = require("../controllers/middleware");

const router = express.Router();  

// router.post("/test", hotelController.testAPI);
// router.get("/read", hotelController.sendAPI);

// CREATER
router.post(
  "/admin/addHotel",
  middlewareController.middleware,
  hotelController.adminAddHotel
);

//READ

router.get("/getHotel", hotelController.getHotel);

router.get("/search-hotel", hotelController.seacchHotel);

router.get("/getDetailHotel/:_id", hotelController.getDetailHotel);

router.post("/postHotel", hotelController.postHotel);

router.get(
  "/admin/getHotels",
  middlewareController.middleware,
  hotelController.adminGetHotels
);

router.get(
  "/admin/get-hotel/:id",
  middlewareController.middleware,
  hotelController.adminGetHotel
);

//UPDATE

router.put(
  "/admin/update-hotel/:id",
  middlewareController.middleware,
  hotelController.updateHotel
);

//DELETE

router.put(
  "/admin/delete-hotel/:id",
  middlewareController.middleware,
  hotelController.deleteHotel
);

module.exports = router;
