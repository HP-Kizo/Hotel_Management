import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./roomDashboard.css";
import { useSelector } from "react-redux";
function RoomDashboard() {
  const adminLogin = useSelector((state) => state.adminLogin);
  const [dataRooms, setDataRooms] = useState();
  const navigate = useNavigate();
  const sendRequestGetRooms = async () => {
    const request = await fetch(
      `http://localhost:5000/rooms/admin/get-rooms?token=${adminLogin.token}`
    );
    const data = await request.json();
    data && setDataRooms(data);
  };
  useEffect(() => {
    sendRequestGetRooms();
  }, []);

  const handlerRoom = async (type, _id) => {
    if (type === "delete") {
      try {
        const confirmDelete = window.confirm(
          "Bạn có chắc chắn muốn xóa không?"
        );
        if (confirmDelete) {
          await fetch(
            `http://localhost:5000/rooms/admin/delete-room/${_id}?token=${adminLogin.token}`,
            { method: "PUT" }
          )
            .then((result) => result.json())
            .then(async ({ message }) => {
              if (message) {
                await sendRequestGetRooms();
                alert(message);
              }
            });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate(`/edit-room/${_id}`);
    }
  };
  return (
    <>
      <section className="wrap--content">
        <div className="wrap--content__container wrap--hotel">
          <h3>Rooms List</h3>
          <button
            className="btn btn__size_m"
            onClick={() => {
              navigate("/new-room");
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
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Max People</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataRooms &&
                dataRooms.length > 0 &&
                dataRooms.map((res, index) => {
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
                      <td>{res.title}</td>
                      <td className="td-desc">
                        {res.desc.substring(0, 50)}...
                      </td>
                      <td>{res.price}</td>
                      <td>{res.maxPeople}</td>

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
                            handlerRoom("delete", res._id);
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn__size_s"
                          onClick={() => {
                            handlerRoom("edit", res._id);
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

export default RoomDashboard;
