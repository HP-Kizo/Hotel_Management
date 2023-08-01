import { useState, useEffect } from "react";
import "./featuredProperties.css";

const FeaturedProperties = ({ dataHotel }) => {
  const currentDomain = window.location.host;

  const [topRatingHotel, setTopRatingHotel] = useState();
  useEffect(() => {
    dataHotel &&
      Array.isArray(dataHotel) &&
      setTopRatingHotel(
        [...dataHotel].sort((a, b) => b.rating - a.rating).slice(0, 3)
      );
  }, [dataHotel]);
  return (
    <div className="fp">
      {topRatingHotel &&
        topRatingHotel.map((res) => {
          return (
            <div className="fpItem" key={res._id}>
              <img src={res.photos[3]} alt="" className="fpImg" />
              <span className="fpName">
                <a href={`./hotels/${res._id}`} target="_blank">
                  {res.name}
                </a>
              </span>
              <span className="fpCity">{res.city}</span>
              <span className="fpPrice">
                Starting from ${res.cheapestPrice}
              </span>
              <div className="fpRating">
                <button>{res.rating}</button>
                <span>Excellent</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FeaturedProperties;
