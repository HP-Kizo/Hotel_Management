import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
function EditRoom() {
  const params = useParams();
  useEffect(() => {
    const FindRoomByID = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/rooms/admin/get-room/${params.id}?token=${adminLogin.token}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          console.log("Có lỗi khi lấy dữ liệu từ API");
        }
      } catch (error) {
        console.error(error);
      }
    };
    FindRoomByID();
  }, []);

  const [formData, setFormData] = useState();
  const [errors, setErrors] = useState({});
  const adminLogin = useSelector((state) => state.adminLogin);
  const navigate = useNavigate();
  function handlerChange(e) {
    setErrors({ ...errors, [e.target.name]: "" });
    if (e.target.name === "roomNumbers") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value.split(" ").map((item) => {
          return {
            unavailabelDate: [],
            number: parseInt(item),
          };
        }),
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }
  console.log(formData);
  const sendUpdateRoom = () => {
    fetch(
      `http://localhost:5000/rooms/admin/update-room/${params.id}?token=${adminLogin.token}`,
      {
        method: "PUT",
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
      .catch((err) =>
        setErrors({ ...errors, password: "Incorrect username or password" })
      );
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
      sendUpdateRoom();
    }
  }
  return (
    <section className="wrap--content">
      {formData && (
        <div className="wrap__container--newhotel">
          <div className="wrap--content__title">
            <h3 className="wrap--content__title__item">Add New Product </h3>
          </div>
          <div className="new-hotel-wrap">
            <div className="new-hotel-wrap__left">
              <div className="new-hotel-item">
                <label>Title</label>
                <input
                  onChange={handlerChange}
                  name="title"
                  type="text"
                  value={formData.title}
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="new-hotel-item">
                <label>Price</label>
                <input
                  onChange={handlerChange}
                  name="price"
                  placeholder=""
                  type="number"
                  value={formData.price}
                />
                {errors.price && <span className="error">{errors.price}</span>}
              </div>
              <div className="new-hotel-item">
                <label>Rooms</label>
                <input
                  onChange={handlerChange}
                  name="roomNumbers"
                  placeholder=""
                  type="text"
                  value={formData.roomNumbers
                    .map((room) => room.number)
                    .join(" ")}
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
                  value={formData.desc}
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
                  value={formData.maxPeople}
                />
                {errors.maxPeople && (
                  <span className="error">{errors.maxPeople}</span>
                )}
              </div>
            </div>
          </div>
          <button className="btn-new" onClick={handlerSubmit}>
            Send
          </button>
        </div>
      )}
    </section>
  );
}

export default EditRoom;
