import { useSelector } from "react-redux";
import "./new-room.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function NewRoom() {
  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const [dataHotels, setDataHotels] = useState();
  const adminLogin = useSelector((state) => state.adminLogin);
  const navigate = useNavigate();
  function handlerChange(e) {
    if (e.target.name === "roomNumbers") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.split(" ").map((number) => {
          return {
            number: parseInt(number),
            unavailabelDate: [],
          };
        }),
      });
      return;
    }
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  console.log(formData);
  const sendRequestGetHotels = async () => {
    const request = await fetch(
      `http://localhost:5000/hotels/admin/getHotels?token=${adminLogin.token}`
    );
    const data = await request.json();
    setFormData({ ...formData, hotel: "" });
    setDataHotels(data);
  };
  useEffect(() => {
    sendRequestGetHotels();
  }, []);
  const sendNewRoom = () => {
    fetch(
      `http://localhost:5000/rooms/admin/add-room?${formData.hotel}&token=${adminLogin.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return navigate("/rooms");
      })
      .catch((err) => setErrors({ ...errors, password: "Add room failed" }));
  };
  function handlerSubmit() {
    const error = {};
    if (!formData.title) {
      error.title = " Please enter title";
    } else if (!formData.price) {
      error.price = " Please enter price";
    } else if (!formData.roomNumbers) {
      error.roomNumbers = "Please enter rooms";
    } else if (!formData.desc) {
      error.desc = "Please enter desciption";
    } else if (!formData.maxPeople) {
      error.maxPeople = "Please enter max people";
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      sendNewRoom();
    }
  }
  return (
    <section className="wrap--content">
      <div className="wrap__container--newhotel">
        <div className="wrap--content__title">
          <h3 className="wrap--content__title__item">Add New Product </h3>
        </div>
        <div className="new-hotel-wrap">
          <div className="new-hotel-wrap__left">
            <div className="new-hotel-item">
              <label>Title</label>
              <input onChange={handlerChange} name="title" type="text" />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Price</label>
              <input
                onChange={handlerChange}
                name="price"
                placeholder=""
                type="number"
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Rooms</label>
              <input
                onChange={handlerChange}
                name="roomNumbers"
                type="text"
                placeholder="Give comma between room numbers"
              />
              {errors.roomNumbers && (
                <span className="error">{errors.roomNumbers}</span>
              )}
            </div>
          </div>
          <div className="new-hotel-wrap__right">
            <div className="new-hotel-item">
              <label>Description</label>
              <input
                onChange={handlerChange}
                name="desc"
                placeholder=""
                type="text"
              />
              {errors.desc && <span className="error">{errors.desc}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Max People</label>
              <input
                onChange={handlerChange}
                name="maxPeople"
                placeholder=""
                type="number"
              />
              {errors.maxPeople && (
                <span className="error">{errors.maxPeople}</span>
              )}
            </div>
            <div className="new-hotel-item">
              <label className="new-hotel-label">Choose a hotel</label>
              <select
                className="new-hotel-select"
                name="hotel"
                onChange={handlerChange}
              >
                <option value="">No</option>
                {dataHotels &&
                  dataHotels.map((hotel) => (
                    <option value={hotel._id}>{hotel.name}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <button className="btn-new" onClick={handlerSubmit}>
          Send
        </button>
      </div>
    </section>
  );
}

export default NewRoom;
