import React, { useState } from "react";
import Navbar from "../../navbar/Navbar";
import "./register.css";
import { useNavigate } from "react-router-dom";

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
  console.log(formData);
  const sendDataRegister = () => {
    fetch("http://localhost:5000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === "OK") {
          return navigate("/login");
        } else {
          setErrors({ ...errors, username: data.error });
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
      <Navbar></Navbar>
      <form onSubmit={handleSubmit} className="content">
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
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <br />
        <button type="submit">Create Account</button>
      </form>
    </>
  );
}

export default Register;
