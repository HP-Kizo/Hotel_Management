import { Link, Router, Routes, Route, useNavigate } from "react-router-dom";
import "./home.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import HotelDashboard from "./hotel/HotelDashboard";
import NewHotel from "./new-hotel/New-Hotel";
import RoomDashboard from "./rooms/RoomDashboard";
import NewRoom from "./new-room/New-Room";
import TransactionDashboard from "./transactions/TransactionDashboard";
import UserDashboard from "./users/UserDashboard";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./dashboard/Dashboard";
import EditHotel from "./edit-hotel/EditHotel";
import EditRoom from "./edit-room/EditRoom";
import Login from "../../component/authentication/signIn/login";
import { LOGOUT } from "../../component/context/context";

function Home() {
  const adminLogin = useSelector((state) => state.adminLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataTransaction, setDataTransaction] = useState();
  useEffect(() => {
    const sendRequestGetTransaction = async () => {
      const request = await fetch(
        `http://localhost:5000/transactions/admin/getTransaction?token=${adminLogin.token}`
      );
      const data = await request.json();
      data && setDataTransaction(data);
    };
    sendRequestGetTransaction();
  }, []);
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ADMIN</span>
        </Link>
      </div>

      <main className="wrap">
        <div className="wrap__menu">
          <ul className="warp__menu--outside">
            <p className="title">MAIN</p>
            <Link to="/" style={{ textDecoration: "none" }}>
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          </ul>
          <ul className="warp__menu--outside">
            <p className="title">LISTS</p>
            <Link to="/users" style={{ textDecoration: "none" }}>
              <li>
                <PersonOutlineIcon className="icon" />
                <span>Users</span>
              </li>
            </Link>
            <Link to="/hotels" style={{ textDecoration: "none" }}>
              <li>
                <StoreIcon className="icon" />
                <span>Hotels</span>
              </li>
            </Link>
            <Link to="/rooms" style={{ textDecoration: "none" }}>
              <li>
                <CreditCardIcon className="icon" />
                <span>Rooms</span>
              </li>
            </Link>
            <Link to="/transactions" style={{ textDecoration: "none" }}>
              <li>
                <LocalShippingIcon className="icon" />
                <span>Transactions</span>
              </li>
            </Link>
          </ul>
          <ul className="warp__menu--outside">
            <p className="title">NEW</p>
            <Link to="/new-hotel" style={{ textDecoration: "none" }}>
              <li>
                <StoreIcon className="icon" />
                <span>New Hotel</span>
              </li>
            </Link>
            <Link to="/new-room" style={{ textDecoration: "none" }}>
              <li>
                <CreditCardIcon className="icon" />
                <span>New Room</span>
              </li>
            </Link>
          </ul>

          <ul className="warp__menu--outside">
            <p className="wrap__menu--label">USER</p>
            <li>
              <ExitToAppIcon className="icon" />
              <button
                onClick={async () => {
                  dispatch({ type: LOGOUT });
                  navigate("/login");
                }}
                className="wrap__menu--item btn--logout "
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
        {/* <article className="wrap__menu">
          <ul className="warp__menu--outside">
            <label className="wrap__menu--label">MAIN</label>

            <li>
              <FontAwesomeIcon icon={faBars} />
              <Link to="/" className="wrap__menu--item ">
                Dashboard
              </Link>
            </li>
          </ul>
          <ul className="warp__menu--outside">
            <label className="wrap__menu--label">LISTS</label>
            <li>
              <FontAwesomeIcon icon={faUser} />
              <Link to="/users" className="wrap__menu--item ">
                Users
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faHotel} />
              <Link to="/hotels" className="wrap__menu--item ">
                Hotels
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faRestroom} />
              <Link to="/rooms" className="wrap__menu--item ">
                Rooms
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faCaravan} />
              <Link to="/transactions" className="wrap__menu--item ">
                Transactions
              </Link>
            </li>
          </ul>

          <ul className="warp__menu--outside">
            <label className="wrap__menu--label">NEW</label>
            <li>
              <FontAwesomeIcon icon={faHotel} />
              <Link to="/new-hotel" className="wrap__menu--item">
                New Hotel
              </Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faRestroom} />
              <Link to="/new-room" className="wrap__menu--item ">
                New Room
              </Link>
            </li>
          </ul>
          <ul className="warp__menu--outside">
            <label className="wrap__menu--label">MAIN</label>
            <li>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <button
                // to="/login"
                onClick={async () => {
                  dispatch({ type: LOGOUT });
                  navigate("/login");
                }}
                className="wrap__menu--item btn--logout "
              >
                Logout
              </button>
            </li>
          </ul>
        </article> */}
        <Routes>
          <Route path="/*" element={<Dashboard />} />
          <Route path="/hotels" element={<HotelDashboard />} />
          <Route path="/new-hotel" element={<NewHotel />} />
          <Route path="/rooms" element={<RoomDashboard />} />
          <Route path="/new-room" element={<NewRoom />} />
          <Route path="/transactions" element={<TransactionDashboard />} />
          <Route path="/users" element={<UserDashboard />} />
          <Route path="/edit-hotel/:id" element={<EditHotel />} />
          <Route path="/edit-room/:id" element={<EditRoom />} />
          {/* <Route path="/logout" element={<Login />} /> */}

          {/* <Route path="/users/:id" element={<UserDetail />} /> */}
          {/* Add more nested routes here */}
        </Routes>
      </main>
    </div>
  );
}

export default Home;
