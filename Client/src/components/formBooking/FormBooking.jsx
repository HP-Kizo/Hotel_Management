import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  faBed,
  faCalendarDays,
  faCar,
  faL,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./formBooking.css";
import Featured from "../featured/Featured";
import { useSelector } from "react-redux";
import axios from "axios";
import da from "date-fns/esm/locale/da/index.js";
function FormBooking({ state, hotelDetail }) {
  const userLogin = useSelector((state) => state.userLogin);
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [doubleRoom, setDoubleRoom] = useState([]);
  const [twinRoom, setTwinRoom] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [diffDays, setDiffDays] = useState(1);
  const [isChecked, setIsChecked] = useState(undefined);
  const [roomSelect, setRoomSelect] = useState([]);
  const [selectedValue, setSelectedValue] = useState("Cash");
  const navigate = useNavigate();
  const [info, setInfo] = useState(userLogin);

  const [errol, setErrol] = useState({});
  const [date, setDate] = useState(state);
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const date = new Date(start.getTime());
    let list = [];
    while (date <= end) {
      list.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return list;
  };
  const dateStart = date.startDate;
  const dateEnd = date.endDate;
  const formatDate = (date) => {
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate;
  };
  console.log(hotelDetail);
  useEffect(() => {
    const fetchRoom = async (_id) => {
      fetch("http://localhost:5000/rooms/postRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            _idHotel: hotelDetail._id,
            listIdRoom: _id,
            date: date[0],
          },
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          setRoom(res);
          setDoubleRoom(
            res.filter((result) => {
              return result.type === "double";
            })
          );
          setTwinRoom(
            res.filter((result) => {
              return result.type === "twin";
            })
          );
        })
        .catch((err) => console.log(err));
    };
    hotelDetail && fetchRoom(hotelDetail.rooms);
  }, [date]);
  console.log("Double", doubleRoom);
  console.log("Twin", twinRoom);
  useEffect(() => {
    // Chuyển đổi thành số mili giây
    const timeDiff = Math.abs(
      date[0].endDate.getTime() - date[0].startDate.getTime()
    );

    // Chuyển đổi thành số ngày
    setDiffDays(Math.ceil(timeDiff / (1000 * 3600 * 24) + 1));
  }, [date]);
  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
    setErrol({ ...errol, [e.target.name]: "" });
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value); // Cập nhật giá trị đã chọn vào state
  };
  // Xử lý
  const listDate = getDatesInRange(date[0].startDate, date[0].endDate);
  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailabelDate.some((date) => {
      return listDate.includes(date);
    });
    return isFound;
  };
  const handleReserve = async () => {
    const error = {};

    if (!info.fullName) {
      error.username = " Please enter username";
    } else if (!info.email) {
      error.password = " Please enter password";
    } else if (!info.phoneNumber) {
      error.phoneNumber = "Please enter phone number";
    } else if (!info.cardNumber) {
      error.cardNumber = "Please enter card number";
    }
    if (Object.keys(error).length > 0) {
      setErrol(error);
    } else {
      if (roomSelect.length > 0) {
        const dataRequest = {
          user: userLogin._id,
          hotel: hotelDetail._id,
          room: roomSelect,
          dateStart: listDate[0],
          dateEnd: listDate[listDate.length - 1],
          price: totalBill,
          payment: selectedValue,
          status: "Booked",
          info: info,
        };

        await axios.put("http://localhost:5000/rooms/updateRoomAvailability", {
          data: {
            roomSelect: roomSelect,
            date: listDate,
          },
        });
        axios
          .post("http://localhost:5000/transactions/postReserve", {
            data: dataRequest,
          })
          .then((respon) => {
            console.log(respon);
            if (respon.data.message === "OK") {
              navigate("/transaction");
            }
          })
          .catch((errol) => console.log(errol));
      }
    }
  };
  console.log("Room select ", roomSelect);
  return (
    <>
      <div className="container">
        <div className="left-side">
          {
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                setDate([item.selection]);
                setIsChecked(false);
                setTotalBill(0);
              }}
              moveRangeOnFirstSelection={false}
              ranges={date}
              className="container--date"
              minDate={new Date()}
            />
          }
        </div>
        <div className="right-side">
          <label>Your Full Name</label>
          <input
            type="text"
            name="fullname"
            value={info.fullName}
            placeholder="Full Name"
            onChange={handleChange}
          />
          {errol.fullName && <span className="error">{errol.fullName}</span>}

          <label>Your Email</label>
          <input
            type="text"
            name="email"
            value={info.email}
            placeholder="Email"
            onChange={handleChange}
          />
          {errol.email && <span className="error">{errol.email}</span>}

          <label>Your Phone Number</label>
          <input
            type="number"
            name="phone"
            value={info.phoneNumber}
            placeholder="Phone Number"
            onChange={handleChange}
          />
          {errol.phoneNumber && (
            <span className="error">{errol.phoneNumber}</span>
          )}

          <label>Your Identity Card Number</label>
          <input
            name="cardNumber"
            type="number"
            value={info.cardNumber}
            placeholder="Card Number"
            onChange={handleChange}
          />
          {errol.cardNumber && (
            <span className="error">{errol.cardNumber}</span>
          )}
        </div>
      </div>
      <div className="container__title">
        <h3 className="title">Select Rooms</h3>
      </div>
      <div className="container">
        <div className="left-side leftside">
          <div className="leftside--detail">
            <h4>Budget Twin Room</h4>
            <p>Pay nothing until {formatDate(dateStart)} </p>
            <p>Max people: </p>
            <p>$ {hotelDetail.cheapestPrice}</p>
          </div>
          <div className="leftside--checkbox">
            {twinRoom &&
              twinRoom.length > 0 &&
              twinRoom.map((res) => {
                return res.roomNumbers.map((result, index) => {
                  return (
                    <section className="checkbox">
                      <label className="checkbox--label">{result.number}</label>
                      <input
                        type="checkbox"
                        className="leftside--checkbox__item checkbox--input"
                        name=""
                        disabled={isAvailable(result)}
                        checked={isChecked ? undefined : false}
                        onChange={(e) => {
                          setIsChecked(true);
                          e.target.checked === true
                            ? setRoomSelect([
                                ...roomSelect,
                                { _id: result._id, number: result.number },
                              ])
                            : setRoomSelect(
                                roomSelect.filter(
                                  (respon) => respon._id !== result._id
                                )
                              );
                          e.target.checked === true
                            ? setTotalBill(
                                totalBill +
                                  parseInt(hotelDetail.cheapestPrice) * diffDays
                              )
                            : setTotalBill(
                                totalBill -
                                  parseInt(hotelDetail.cheapestPrice) * diffDays
                              );
                        }}
                        value={hotelDetail.cheapestPrice}
                      />
                    </section>
                  );
                });
              })}
            {twinRoom && !twinRoom.length > 0 && (
              <span style={{ color: "red" }}>Sorry, no rooms available</span>
            )}
          </div>
        </div>
        <div className="right-side rightside">
          <div className="leftside--detail">
            <h4>Budget Double Room</h4>
            <p>Pay nothing until {formatDate(dateStart)} </p>
            <p>Max people: </p>
            <p>$ {hotelDetail.cheapestPrice}</p>
          </div>
          <div className="leftside--checkbox">
            {doubleRoom &&
              doubleRoom.length > 0 &&
              doubleRoom.map((res) => {
                return res.roomNumbers.map((result, index) => {
                  return (
                    <section className="checkbox">
                      <label className="checkbox--label">{result.number}</label>
                      <input
                        type="checkbox"
                        className="leftside--checkbox__item checkbox--input"
                        name=""
                        disabled={isAvailable(result)}
                        checked={isChecked ? undefined : false}
                        onChange={(e) => {
                          setIsChecked(true);
                          e.target.checked === true
                            ? setRoomSelect([
                                ...roomSelect,
                                { _id: result._id, number: result.number },
                              ])
                            : setRoomSelect(
                                roomSelect.filter(
                                  (respon) => respon._id !== result._id
                                )
                              );
                          e.target.checked === true
                            ? setTotalBill(
                                totalBill +
                                  parseInt(hotelDetail.cheapestPrice) * diffDays
                              )
                            : setTotalBill(
                                totalBill -
                                  parseInt(hotelDetail.cheapestPrice) * diffDays
                              );
                        }}
                        value={hotelDetail.cheapestPrice}
                      />
                    </section>
                  );
                });
              })}
            {/* {doubleRoom && !(doubleRoom.length > 0) && (
              <span style={{ color: "red" }}>Sorry, no rooms available</span>
            )} */}
          </div>
        </div>
      </div>
      <div className="wrap">
        <h2 className="wrap--bill__h2">Total Bill: ${totalBill}</h2>
        <div className="wrap--selection">
          <select
            className="wrap--selection__payment"
            value={selectedValue}
            onChange={handleSelectChange}
          >
            <option value="Cash">Select Payment Method</option>
            <option value="Credit Cart">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
          <button
            className={`${roomSelect.length > 0 ? "btn" : "btn disable"}`}
            onClick={handleReserve}
          >
            Reserve Now
          </button>
        </div>
      </div>
      <div className="padding"></div>
    </>
  );
}

export default FormBooking;
