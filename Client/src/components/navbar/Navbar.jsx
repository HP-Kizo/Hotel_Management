import "./navbar.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../context/context";
const Navbar = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const clickLogout = () => {
    dispatch({ type: LOGOUT });
    navigate("/login");
  };
  const clickLogin = () => {
    navigate("/login");
  };
  const clickRegister = () => {
    navigate("/register");
  };
  const clickTransaction = () => {
    navigate("/transaction");
  };
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" className="logo">
          Booking Website
        </Link>

        <div className="navItems">
          {userLogin ? (
            <>
              <span className="email">{userLogin.email}</span>

              <button className="navButton" onClick={clickTransaction}>
                Transaction
              </button>
              <button className="navButton" onClick={clickLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="navButton" onClick={clickRegister}>
                Register
              </button>
              <button className="navButton" onClick={clickLogin}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
