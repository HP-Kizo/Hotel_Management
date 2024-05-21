const Room = require("../models/room");
const Transaction = require("../models/transaction");
const Hotel = require("../models/hotel");

// Lọc các room phù hợp với mốc thời gian booking
exports.postRoom = async (req, res, next) => {
  try {
    const requestData = req.body.data;

    const listID = requestData.listIdRoom;
    const startDate = new Date(requestData.date.startDate);
    const endDate = new Date(requestData.date.endDate);

    const transactions = await Transaction.find({
      hotel: requestData._idHotel,
    });

    const roomBooked = transactions.filter((transaction) => {
      const transactionStartDate = new Date(transaction.dateStart);
      const transactionEndDate = new Date(transaction.dateEnd);

      return (
        // (transactionStartDate <= startDate && transactionEndDate <= endDate) ||
        (transactionStartDate >= startDate &&
          transactionStartDate <= endDate) ||
        (transactionEndDate >= startDate && transactionEndDate <= endDate) ||
        (transactionStartDate <= startDate && transactionEndDate >= endDate)
      );
    });

    const listRoomBooked = roomBooked.reduce((acc, tranItem) => {
      acc.push(...tranItem.room);
      return acc;
    }, []);

    if (listRoomBooked.length > 0) {
      const roomIdsBooked = listRoomBooked.map((item) => item._id.toString());
      const dataRespon = await Room.find({
        _id: { $in: listID, $nin: roomIdsBooked },
      });
      res.json(dataRespon);
    } else {
      const dataRespon = await Room.find({ _id: { $in: listID } });

      res.json(dataRespon);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.updateRoomAvailability = async (req, res, next) => {
  const listRoomNumber = req.body.data.roomSelect;
  const date = req.body.data.date;

  try {
    const promises = listRoomNumber.map((_id) => {
      if (_id) {
        return Room.updateOne(
          { "roomNumbers._id": _id },
          {
            $addToSet: {
              "roomNumbers.$.unavailabelDate": date,
            },
          }
        );
      }
    });
    await Promise.all(promises);
    return res.status(200).json("Room has been updated");
  } catch (error) {
    next(error);
  }
};

//--------------------------------------------------ADMIN MANAGER-------------------------------------------------------------------------------//

//-------------------- CREATE

exports.adminAddRoom = async (req, res, next) => {
  const idHotel = req.query.id;
  const newRoom = new Room(req.body);
  console.log(req.body);
  try {
    const saveRoom = await newRoom.save();
    if (req.body.hotel !== "") {
      try {
        await Hotel.findByIdAndUpdate(idHotel, {
          $push: { rooms: saveRoom._id },
        });
      } catch (error) {
        console.log("Update hotel khi thêm room thất bại");
      }
    }
    return res.status(200).json(saveRoom);
  } catch (error) {
    return res.status(400).json({ errol: "Tạo Room thất bại" });
  }
};

//--------------------  READ

// Admin get All Room
exports.adminGetAllRoom = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(401).json({ message: "Lấy ALL Room thất bại " });
  }
};

exports.adminGetRoom = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const room = await Room.findById(req.params.id);
    console.log(room);
    if (room) {
      return res.status(200).json(room);
    } else {
      return res.status(404).json({ message: "Không tìm thấy khách sạn" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

//--------------------  UPDATE

exports.adminUpdateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json(err);
  }
};
//--------------------  DELETE

exports.adminDeleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findOne({ _id: roomId });
    if (room) {
      const listID = room.roomNumbers.map((room) => room._id);

      const transaction = await Transaction.findOne({
        "room._id": { $in: listID },
      });
      if (!transaction) {
        const roomDeleted = await Room.findByIdAndDelete(roomId);
        try {
          await Hotel.updateMany(
            { rooms: roomId },
            { $pull: { rooms: roomId } },
            { new: true },
            (err, hotels) => {
              if (err) {
                console.log(err);
                return;
              }

              console.log(hotels);
            }
          );

          return res.status(200).json({ message: "Room deleted successfully" });
        } catch (error) {
          console.log(error);
          return res.status(401).json({ message: "Error deleting room" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "There are active transactions for this room" });
      }
    } else {
      return res.status(401).json({ message: "Room not found" });
    }

    return res.status(401).json({ message: "Không tìm thấy room cần xóa" });
  } catch (error) {
    return res.status(401).json({ message: " Xóa Room thất bại" });
  }
};
