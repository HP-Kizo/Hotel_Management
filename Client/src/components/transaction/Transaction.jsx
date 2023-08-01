import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import { useEffect, useState } from "react";
import useFetch from "../context/useFetch";
import "./transaction.css";

function Transaction() {
  const userLogin = useSelector((state) => state.userLogin);
  const [dataTransaction, setDataTransaction] = useState([]);
  const [status, setStatus] = useState("Booked");
  const { data, isLoading, error, reFetch } = useFetch(
    `/transactions/data?_id=${userLogin._id}`
  );
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  return (
    <>
      <Navbar></Navbar>
      <div className="transaction__wrap">
        <h2>Your Transactions</h2>
        {isLoading && (
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        )}
        <table className="transaction__wrap--tb table-custom">
          <thead>
            <tr className="transaction__wrap--tr">
              <th>#</th>
              <th>Hotel</th>
              <th>Room</th>
              <th>Date</th>
              <th>Price</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.length > 0 &&
              data.map((res, index) => {
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
                  <tr key={index + res._id}>
                    <td>{index}</td>
                    <td>{res.hotel.name}</td>
                    <td>
                      {res.room.map((room) => (
                        <span>{room.number} </span>
                      ))}
                    </td>
                    <td>{`${dateStart_.getDate()}/${
                      dateStart_.getMonth() + 1
                    }/${dateStart_.getFullYear()} - ${dateEnd_.getDate()}/${
                      dateEnd_.getMonth() + 1
                    }/${dateEnd_.getFullYear()}`}</td>
                    <td>${res.price}</td>
                    <td>{res.payment}</td>
                    {res.status === "Checkin" && (
                      <td
                        className="status"
                        style={{ backgroundColor: "#39d139" }}
                      >
                        {res.status}
                      </td>
                    )}
                    {res.status === "Checkout" && (
                      <td
                        className="status"
                        style={{ backgroundColor: "#dedbfd" }}
                      >
                        {res.status}
                      </td>
                    )}
                    {res.status === "Booked" && (
                      <td
                        className="status"
                        style={{ backgroundColor: "#f5b8ad" }}
                      >
                        {res.status}
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Transaction;
