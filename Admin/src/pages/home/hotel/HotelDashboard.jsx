import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./hotelDashboard.css";
import { useSelector } from "react-redux";
function HotelDashboard() {
  const adminLogin = useSelector((state) => state.adminLogin);
  const [dataHotels, setDataHotels] = useState();
  const navigate = useNavigate();
  const sendRequestGetHotels = async () => {
    const request = await fetch(
      `http://localhost:5000/hotels/admin/getHotels?token=${adminLogin.token}`
    );
    const data = await request.json();
    data && setDataHotels(data);
  };
  useEffect(() => {
    sendRequestGetHotels();
  }, []);

  const handlerHotel = async (type, _id) => {
    if (type === "delete") {
      try {
        const confirmDelete = window.confirm(
          "Bạn có chắc chắn muốn xóa không?"
        );
        if (confirmDelete) {
          await fetch(
            `http://localhost:5000/hotels/admin/delete-hotel/${_id}?token=${adminLogin.token}`,
            { method: "PUT" }
          )
            .then((result) => result.json())
            .then(async ({ message }) => {
              if (message) {
                await sendRequestGetHotels();
                alert(message);
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/edit-hotel/${_id}`);
    }
  };
  return (
    <>
      <section className="wrap--content">
        <div className="wrap--content__container wrap--hotel">
          <h3>Hotels List</h3>
          <button
            className="btn btn__size_m"
            onClick={() => {
              navigate("/new-hotel");
            }}
          >
            Add New
          </button>
        </div>
        <div className="wrap--content__showTransaction">
          <h3>Latest Transactions</h3>
          <table className="table table-custom">
            <thead className="table--tr">
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Title</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataHotels &&
                dataHotels.length > 0 &&
                dataHotels.map((res, index) => {
                  const dateStart_ = new Date(res.dateStart);
                  const dateEnd_ = new Date(res.dateEnd);
                  const newDate = new Date();
                  if (newDate >= dateStart_ && newDate <= dateEnd_) {
                    res.status = "Checkin";
                  } else if (newDate > dateEnd_) {
                    res.status = "Checkout";
                  } else {
                    res.status = "Booked";
                  }
                  return (
                    <tr key={index + res._id} className="table--tr">
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{res._id}</td>
                      <td>{res.name}</td>
                      <td>{res.type}</td>
                      <td>{res.name}</td>
                      <td>{res.city}</td>

                      <td>
                        <input type="hidden" value={res._id}></input>
                        <button
                          style={{
                            backgroundColor: "#ffffff",
                            color: "red",
                            border: "red",
                            borderStyle: "dotted",
                            padding: "2px 10px",
                          }}
                          className="btn btn__size_s"
                          onClick={() => {
                            handlerHotel("delete", res._id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn__size_s"
                          onClick={() => {
                            handlerHotel("edit", res._id);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default HotelDashboard;
