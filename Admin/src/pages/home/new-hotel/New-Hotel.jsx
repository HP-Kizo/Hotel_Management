import { useSelector } from "react-redux";
import "./new-Hotel.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function NewHotel() {
  const [formData, setFormData] = useState({ featured: false });
  const [errors, setErrors] = useState({});
  const adminLogin = useSelector((state) => state.adminLogin);
  const navigate = useNavigate();
  function handlerChange(e) {
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "rooms") {
      setFormData({ ...formData, [e.target.name]: [e.target.value] });
    } else if (e.target.name === "photos") {
      const { value } = e.target;
      const photosArray = value.split(",");
      setFormData({ ...formData, photos: photosArray });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }
  const sendNewHotel = () => {
    fetch(
      `http://localhost:5000/hotels/admin/addHotel?token=${adminLogin.token}`,
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
        return navigate("/hotels");
      })
      .catch((err) =>
        setErrors({ ...errors, password: "Incorrect username or password" })
      );
  };
  function handlerSubmit() {
    const error = {};
    if (!formData.name) {
      error.name = " Please enter name";
    } else if (!formData.city) {
      error.city = " Please enter city";
    } else if (!formData.distance) {
      error.distance = "Please enter distance";
    } else if (!formData.desc) {
      error.desc = "Please enter desciption";
    } else if (!formData.photos) {
      error.photos = "Please enter image";
    } else if (!formData.rooms) {
      error.rooms = "Please enter rooms";
    } else if (!formData.type) {
      error.type = "Please enter type";
    } else if (!formData.address) {
      error.address = "Please enter address";
    } else if (!formData.title) {
      error.title = "Please enter title";
    } else if (!formData.cheapestPrice) {
      error.cheapestPrice = "Please enter price";
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      sendNewHotel();
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
              <label>Name</label>
              <input onChange={handlerChange} name="name" type="text" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="new-hotel-item">
              <label>City</label>
              <input
                onChange={handlerChange}
                name="city"
                placeholder=""
                type="text"
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Distance from City Center</label>
              <input
                onChange={handlerChange}
                name="distance"
                placeholder=""
                type="text"
              />
              {errors.distance && (
                <span className="error">{errors.distance}</span>
              )}
            </div>
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
              <label>Image</label>
              <input
                onChange={handlerChange}
                name="photos"
                placeholder=""
                type="text"
              />
              {errors.photos && <span className="error">{errors.photos}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Rooms</label>
              <input
                onChange={handlerChange}
                name="rooms"
                placeholder="ID Room"
                type="text"
              />
              {errors.rooms && <span className="error">{errors.rooms}</span>}
            </div>
          </div>
          <div className="new-hotel-wrap__right">
            <div className="new-hotel-item">
              <label>Type</label>
              <input
                onChange={handlerChange}
                name="type"
                placeholder=""
                type="text"
              />
              {errors.type && <span className="error">{errors.type}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Address</label>
              <input
                onChange={handlerChange}
                name="address"
                placeholder=""
                type="text"
              />
              {errors.address && (
                <span className="error">{errors.address}</span>
              )}
            </div>
            <div className="new-hotel-item">
              <label>Title</label>
              <input
                onChange={handlerChange}
                name="title"
                placeholder=""
                type="text"
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>
            <div className="new-hotel-item">
              <label>Price</label>
              <input
                onChange={handlerChange}
                name="cheapestPrice"
                placeholder=""
                type="number"
              />
              {errors.cheapestPrice && (
                <span className="error">{errors.cheapestPrice}</span>
              )}
            </div>
            <div className="new-hotel-item">
              <label className="new-hotel-label">Featured</label>
              <select
                className="new-hotel-select"
                name="featured"
                onChange={handlerChange}
              >
                <option value={false}>No</option>
                <option value={true}>Yes</option>
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

export default NewHotel;
