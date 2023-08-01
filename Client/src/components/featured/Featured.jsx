import "./featured.css";
import { useState, useEffect } from "react";
const Featured = ({ dataHotel }) => {
  const currentDomain = window.location.host;

  const countProperties = (city) => {
    return dataHotel.filter((data) => {
      return data.city === city;
    });
  };
  return (
    dataHotel.length > 0 && (
      <div className="featured">
        <div className="featuredItem">
          <img
            src={`http://${currentDomain}/images/Ha noi.jpg`}
            alt="Ha Noi"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Ha Noi</h1>
            <h2>{countProperties("Ha Noi").length || 0} properties</h2>
          </div>
        </div>

        <div className="featuredItem">
          <img
            src={`http://${currentDomain}/images/HCM.jpg`}
            alt="HCM City"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Ho Chi Minh</h1>
            <h2>{countProperties("Ho Chi Minh").length || 0} properties</h2>
          </div>
        </div>
        <div className="featuredItem">
          <img
            src={`http://${currentDomain}/images/Da Nang.jpg`}
            alt="Da Nang"
            className="featuredImg"
          />
          <div className="featuredTitles">
            <h1>Da Nang</h1>
            <h2>{countProperties("Da Nang").length || 0} properties</h2>
          </div>
        </div>
      </div>
    )
  );
};

export default Featured;
