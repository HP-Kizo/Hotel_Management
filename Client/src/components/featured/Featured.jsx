import { useNavigate } from "react-router-dom";
import "./featured.css";
import { useState, useEffect } from "react";
const Featured = ({ dataHotel }) => {
  const currentDomain = window.location.host;
  const navigate = useNavigate();
  const countProperties = (city) => {
    return dataHotel.filter((data) => {
      return data.city === city;
    });
  };
  const stateNav = (city) => {
    return {
      destination: city,
      options: {
        adult: 1,
        children: 0,
        room: 1,
      },
      date: [
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ],
    };
  };
  return (
    dataHotel.length > 0 && (
      <div className="featured">
        <button
          className="featuredItem"
          onClick={() => {
            navigate("/hotels", {
              state: stateNav("Ha Noi"),
            });
          }}
        >
          <img
            src={`http://${currentDomain}/images/Ha noi.jpg`}
            alt="Ha Noi"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Ha Noi</h1>
            <h2>{countProperties("Ha Noi").length || 0} properties</h2>
          </div>
        </button>

        <button
          className="featuredItem"
          onClick={() => {
            navigate("/hotels", {
              state: stateNav("Ho Chi Minh"),
            });
          }}
        >
          <img
            src={`http://${currentDomain}/images/HCM.jpg`}
            alt="HCM City"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Ho Chi Minh</h1>
            <h2>{countProperties("Ho Chi Minh").length || 0} properties</h2>
          </div>
        </button>
        <button
          className="featuredItem"
          onClick={() => {
            navigate("/hotels", {
              state: stateNav("Da Nang"),
            });
          }}
        >
          <img
            src={`http://${currentDomain}/images/Da Nang.jpg`}
            alt="Da Nang"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Da Nang</h1>
            <h2>{countProperties("Da Nang").length || 0} properties</h2>
          </div>
        </button>
      </div>
    )
  );
};

export default Featured;
