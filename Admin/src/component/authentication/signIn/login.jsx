import "./login.css";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { LOGIN, LOGOUT } from "../../context/context";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const sendDatalogin = () => {
    fetch(
      `http://localhost:5000/users/admin/login?username=${formData.username}&password=${formData.password}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          return setErrors({
            ...errors,
            password: "Incorrect username or password",
          });
        }
        dispatch({ type: LOGIN, user: data });
        return navigate("/");
      })
      .catch((err) =>
        setErrors({ ...errors, password: "Incorrect username or password" })
      );
  };
  const handlerLogin = (e) => {
    e.preventDefault();
    const error = {};
    if (!formData.username) {
      error.username = " Please enter username";
    }
    if (!formData.password) {
      error.password = " Please enter password";
    } else if (formData.password.length < 8) {
      error.password = "Password must be at least 8 characters";
    }

    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      sendDatalogin();
      setFormData({ ...formData, password: "" });
    }
  };
  return (
    <>
      <form className="content">
        <h2>Login</h2>
        <label htmlFor="username"></label>
        <br />
        <input
          type="text"
          id="username"
          name="username"
          onChange={(e) => {
            setErrors({ ...errors, [e.target.name]: "" });
            setFormData({ ...formData, [e.target.name]: e.target.value });
          }}
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <label htmlFor="password"></label>
        <br />
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => {
            setErrors({ ...errors, [e.target.name]: "" });

            setFormData({ ...formData, [e.target.name]: e.target.value });
          }}
          name="password"
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <br />

        <button type="submit" onClick={handlerLogin}>
          Login
        </button>
        <button
          className="register"
          onClick={() => {
            navigate("/admin/register");
          }}
        >
          Register
        </button>
      </form>
    </>
  );
}

export default Login;
