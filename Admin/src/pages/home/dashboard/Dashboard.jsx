import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  faArrowRightFromBracket,
  faBars,
  faCar,
  faCarSide,
  faCaravan,
  faCartShopping,
  faContactCard,
  faExternalLink,
  faHotel,
  faMoneyBill,
  faRestroom,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
function Dashboard() {
  const adminLogin = useSelector((state) => state.adminLogin);
  const [dataTransaction, setDataTransaction] = useState();
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const sendRequestGetTransaction = async () => {
      const request = await fetch(
        `http://localhost:5000/transactions/admin/getTransaction?token=${adminLogin.token}&limit=8`
      );
      const data = await request.json();
      setDataTransaction(data);
      const lengthData = data.data.length - 1;
      const monthStart =
        new Date(data.data[lengthData].dateStart).getMonth() + 1;

      const monthEnd = new Date();
      const total = data.data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price;
      }, 0);
      setTotal(total);
      setBalance(total / (monthEnd.getMonth() + 1 - monthStart + 1));
    };
    sendRequestGetTransaction();
  }, []);

  return (
    <>
      <section className="wrap--content">
        {dataTransaction && (
          <>
            <div className="wrap--content__container">
              <div className="wrap--content__item content__pseudo">
                <p>{dataTransaction.countUser}</p>
                <span className="wrap--content__item__icon">
                  <FontAwesomeIcon icon={faContactCard} />
                </span>
              </div>
              <div className="wrap--content__item content__pseudo">
                <p>{dataTransaction.countTransaction}</p>
                <span className="wrap--content__item__icon">
                  <FontAwesomeIcon icon={faCartShopping} />
                </span>
              </div>
              <div className="wrap--content__item content__pseudo">
                <p>$ {total}</p>
                <span className="wrap--content__item__icon">
                  <FontAwesomeIcon icon={faMoneyBill} />
                </span>
              </div>
              <div className="wrap--content__item content__pseudo">
                <p>$ {balance}</p>
                <span className="wrap--content__item__icon">
                  <FontAwesomeIcon icon={faExternalLink} />
                </span>
              </div>
            </div>
            <div className="wrap--content__showTransaction space">
              <h3>Latest Transactions</h3>
              <table className="table table-custom">
                <thead>
                  <tr className="table--tr">
                    <th>
                      <input type="checkbox"></input>
                    </th>
                    <th>ID</th>
                    <th>User</th>
                    <th>Hotel</th>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dataTransaction.data &&
                    dataTransaction.data.length > 0 &&
                    dataTransaction.data.map((res, index) => {
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
                          <td>{res.user.fullName}</td>

                          <td>{res.hotel.name}</td>
                          <td>
                            {res.room.map((room, i) => (
                              <span key={i + "test"}>{room.number} </span>
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
        )}
      </section>
    </>
  );
}

export default Dashboard;
