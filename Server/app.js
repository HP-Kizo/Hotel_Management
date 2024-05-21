const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { ObjectId } = require("mongodb");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
const User = require("./models/user");
const Hotel = require("./models/hotel");
const Room = require("./models/room");

const userRoutes = require("./routes/user");
const hotelRoutes = require("./routes/hotel");
const roomRoutes = require("./routes/room");
const transactionRoutes = require("./routes/transaction");
// app.get("/test", (req, res, next) => {
//   console.log("OK");
//   const data = {
//     message: "Test Ok",
//   };
//   res.json(data);
// });

const fs = require("fs");

const dataHotelPath = path.join(__dirname, "./data/hotels.json");
const DataHotel = {
  all: function () {
    return JSON.parse(fs.readFileSync(dataHotelPath, "utf8"));
  },
};
const storeHotelsToDatabase = () => {
  const hotelsData = DataHotel.all();

  const promises = hotelsData.map((hotelResult) => {
    return Hotel.findOne({ _id: hotelResult._id.$oid })
      .then((result) => {
        if (!result) {
          const hotel = new Hotel({
            _id: hotelResult._id.$oid,
            name: hotelResult.name,
            type: hotelResult.type,
            city: hotelResult.city,
            address: hotelResult.address,
            distance: hotelResult.distance,
            photos: hotelResult.photos,
            desc: hotelResult.desc,
            rating: hotelResult.rating,
            featured: hotelResult.featured,
            title: hotelResult.title,
            rooms: hotelResult.rooms,
            cheapestPrice: hotelResult.cheapestPrice,
          });
          return hotel.save();
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  });
  return Promise.all(promises);
};

const dataRoomsPath = path.join(__dirname, "./data/rooms.json");
const DataRooms = {
  all: function () {
    return JSON.parse(fs.readFileSync(dataRoomsPath, "utf8"));
  },
};

const storeRoomsToDatabase = () => {
  const roomsData = DataRooms.all();

  const promises = roomsData.map((roomsResult) => {
    return Room.findOne({ _id: roomsResult._id.$oid })
      .then((result) => {
        if (!result) {
          const rooms = new Room({
            _id: roomsResult._id.$oid,
            title: roomsResult.title,
            price: roomsResult.price,
            maxPeople: roomsResult.maxPeople,
            desc: roomsResult.desc,
            roomNumbers: roomsResult.roomNumbers,
            type: roomsResult.type,
          });
          return rooms.save();
        } else {
          return;
        }
      })
      .catch((err) => console.log(err));
  });
  return Promise.all(promises);
};

const initializeDatabase = async () => {
  try {
    await storeRoomsToDatabase();
    await storeHotelsToDatabase();
  } catch (error) {
    console.log(error);
  }
};
initializeDatabase();

app.use("/users", userRoutes);
app.use("/hotels", hotelRoutes);
app.use("/rooms", roomRoutes);
app.use("/transactions", transactionRoutes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Connected to mongoDB");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
