import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";

import { useState, useEffect } from "react";
import Login from "./component/authentication/signIn/login";
import Logout from "./component/authentication/logout/logout";
import Register from "./component/authentication/signUp/register";
import { useSelector } from "react-redux";

function App() {
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5000/test");
  //       const jsonData = await response.json();
  //       setData(jsonData);
  //     } catch (error) {
  //       console.error("Failed to fetch data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  // console.log(data);
  const adminLogin = useSelector((state) => state.adminLogin);
  return (
    <BrowserRouter>
      <Routes>
        {!!adminLogin ? (
          <>
            <Route path="/*" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
          </>
        ) : (
          <Route path="/*" element={<Navigate to="/admin/login" />} />
        )}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
