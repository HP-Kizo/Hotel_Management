import { useNavigate } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ data, date, options }) => {
  const navigate = useNavigate();
  const handleViewDetail = () => {
    navigate(`/hotels/${data._id}`, { state: { date, options } });
  };
  return (
    <div className="searchItem">
      <img src={data.photos[0]} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{data.name}</h1>
        <span className="siDistance">{data.distance} from center</span>
        <span className="siTaxiOp">{data.tity}</span>
        <span className="siSubtitle">{data.desc}</span>
        <span className="siFeatures">Type : {data.type}</span>
        {/* If can cancel */}
        {/* {free_cancel ? (
          <div>
            <span className="siCancelOp">Free cancellation </span>
            <span className="siCancelOpSubtitle">
              You can cancel later, so lock in this great price today!
            </span>
          </div>
        ) : (
          <div></div>
        )} */}
      </div>
      <div className="siDetails">
        <div className="siRating">
          {/* <span>{rate_text}</span> */}
          <button>{data.raiting}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${data.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton" onClick={handleViewDetail}>
            See availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
