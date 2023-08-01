import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    email: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const sendDataRegister = () => {
    axios
      .post("http://localhost:5000/users/admin/register", {
        data: formData,
      })
      .then((respon) => {
        if (respon.data.username) {
          return navigate("/login");
        } else {
          setErrors({ ...errors, username: respon.response.data.error });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra ràng buộc và hiển thị thông báo lỗi
    const errors = {};

    if (!formData.username) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!formData.fullName) {
      errors.fullName = "Full Name is required";
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      errors.email = "Invalid email";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      // Gửi dữ liệu đăng ký đến server

      sendDataRegister();
    }
  };

  return (
    <>
      <form className="content">
        <h2>Sign Up</h2>
        <label htmlFor="username"></label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}

        <label htmlFor="password"></label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <label htmlFor="fullName"></label>
        <input
          type="text"
          placeholder="Full Name"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <span className="error">{errors.fullName}</span>}

        <label htmlFor="phoneNumber"></label>
        <input
          type="number"
          placeholder="Phone"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <span className="error">{errors.phoneNumber}</span>
        )}

        <label htmlFor="email"></label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <br />
        <button type="submit" onClick={handleSubmit}>
          Create Account
        </button>
        <button
          className="register"
          onClick={() => {
            navigate("/admin/login");
          }}
        >
          Login
        </button>
      </form>
    </>
  );
}

export default Register;
