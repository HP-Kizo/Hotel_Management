const Hotel = require("../models/hotel");
const Transaction = require("../models/transaction");
const Room = require("../models/room");
const mongoose = require("mongoose");
const room = require("../models/room");
const { createError } = require("../error/error");

exports.testAPI = async (req, res, next) => {
  try {
    const name = req.body.name;
    req.session.name = name;
    res.send({ message: "OK" }).status(200);
  } catch (error) {
    console.log(error);
  }
};

exports.sendAPI = async (req, res, next) => {
  try {
    console.log(req.session.name);
    res.json({ message: req.session.name }).status(200);
  } catch (error) {
    console.log(error);
  }
};

//CREATE

exports.adminAddHotel = async (req, res, next) => {
  try {
    // Tạo mới đối tượng khách sạn
    const newHotel = new Hotel(req.body);

    // Lưu khách sạn vào cơ sở dữ liệu
    const savedHotel = await newHotel.save();
    console.log("Tạo mới hotel thành công");
    return res.status(201).json(savedHotel);
  } catch (error) {
    next(createError(500, "Đã xảy ra lỗi khi tạo mới khách sạn"));
  }
};

//READ

//Get All
exports.getHotel = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    next(createError(500, "Not Found Hotel"));
  }
};

exports.seacchHotel = async (req, res, next) => {
  const request = req.query;
  const numberPeople = parseInt(request.adult) + parseInt(request.children);
  const regex = new RegExp(request.city, "i");
  try {
    const searchHotel = await Hotel.find({
      city: regex,
      cheapestPrice: { $gte: request.min , $lte: request.max },
    });
    const hotels = searchHotel.filter(
      (hotel) => hotel.rooms.length >= request.room
    );

    const filteredHotels = [];
    for (const hotel of hotels) {
      const listRooms = await Room.find({ _id: { $in: hotel.rooms } });

      const filteredRooms = listRooms.filter((room) => {
        return room.maxPeople >= numberPeople;
      });

      if (filteredRooms.length > 0) {
        filteredHotels.push(hotel);
      }
    }

    res.status(200).json(filteredHotels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get by ID
exports.getDetailHotel = (req, res, next) => {
  const _id = req.params._id;
  Hotel.findById({ _id: _id })
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

exports.postHotel = async (req, res, next) => {
  const searchKeyword = req.body;
  let numberPeople =
    parseInt(searchKeyword.options.adult) +
    parseInt(searchKeyword.options.children);
  let numberRoom = parseInt(searchKeyword.options.room);
  const regex = new RegExp(searchKeyword.destination, "i");
  const date = req.body.date;
  await Hotel.find({ city: regex })
    .exec()
    .then(async (hotels) => {
      if (hotels.length > 0) {
        const filteredHotels = [];
        for (const hotel of hotels) {
          const listRooms = await Room.find({ _id: { $in: hotel.rooms } });

          const filteredRooms = listRooms.filter((room) => {
            return (
              room.maxPeople >= numberPeople &&
              room.roomNumbers.length >= numberRoom
            );
          });

          if (filteredRooms.length > 0) {
            filteredHotels.push(hotel);
          }
        }

        if (filteredHotels.length > 0) {
          return res.status(200).json(filteredHotels);
        } else {
          return res.status(404).json({ error: "No hotels found" });
        }
      } else {
        return res.status(404).json({ error: "No hotels found" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Internal server error" });
    });
};

//--------------------------------------------------ADMIN MANAGER-------------------------------------------------------------------------------//

// READ
exports.adminGetHotel = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const hotel = await Hotel.findById(req.params.id);
    console.log(hotel);
    if (hotel) {
      return res.status(200).json(hotel);
    } else {
      return res.status(404).json({ message: "Không tìm thấy khách sạn" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.adminGetHotels = (req, res, next) => {
  Hotel.find()
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

//UPDATE

exports.updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(500).json(err);
  }
};

//DELETE

exports.deleteHotel = async (req, res, next) => {
  try {
    const data = await Transaction.find({ hotel: req.params.id });

    if (data.length > 0) {
      console.log("Remove hotel fail");
      return res.status(401).json({
        message: "There are active transactions for this hotel",
      });
    }

    await Hotel.findByIdAndDelete(req.params.id)
      .then((result) => {
        if (result) {
          console.log("Remove Success");
          console.log(result);
          return res.status(200).json({ message: "SUCCESS" });
        } else {
          return res.status(401).json({ message: "Hotel not found" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    res.status(500).json({ message: "Fail" });
  }
};
