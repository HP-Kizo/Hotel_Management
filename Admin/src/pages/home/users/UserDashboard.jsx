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
function UserDashboard() {
  const adminLogin = useSelector((state) => state.adminLogin);
  const [dataUsers, setDataUsers] = useState();
  useEffect(() => {
    const sendRequestGetUsers = async () => {
      const request = await fetch(
        `http://localhost:5000/users/admin/get-users?token=${adminLogin.token}`
      );
      const data = await request.json();

      setDataUsers(data);
    };
    sendRequestGetUsers();
  }, []);
  return (
    <>
      <section className="wrap--content">
        <div className="wrap--content__container"></div>
        <div className="wrap--content__showTransaction space">
          <h3>Users</h3>
          <table className="table table-custom">
            <thead>
              <tr className="table--tr">
                <th>
                  <input type="checkbox"></input>
                </th>
                <th>ID</th>
                <th>User</th>
                <th>Name</th>
                <th>Email</th>
                <th>PhoneNumber</th>
              </tr>
            </thead>
            <tbody>
              {dataUsers &&
                dataUsers.length > 0 &&
                dataUsers.map((res, index) => {
                  return (
                    <tr key={index + res._id} className="table--tr">
                      <td>
                        <input type="checkbox"></input>
                      </td>
                      <td>{res._id}</td>
                      <td>{res.username}</td>
                      <td>{res.fullName}</td>
                      <td>{res.email}</td>
                      <td>{res.phoneNumber}</td>
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

export default UserDashboard;
