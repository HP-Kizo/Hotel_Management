import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import axios from "axios";
import useFetch from "../../components/context/useFetch";
const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [options, setOptions] = useState(location.state.options);
  const [openDate, setOpenDate] = useState(false);
  const hotel = useSelector((state) => state.hotel);
  const [form, setForm] = useState({
    city: location.state.destination,
    min: 0,
    max: 9999,
    adult: options.adult,
    room: options.room,
    children: options.children,
  });
  const [hotelData, setHotelData] = useState(null);
  const { data, isLoading, error, reFetch } = useFetch(
    `/hotels/search-hotel?city=${form.city}&min=${form.min}&max=${form.max}&adult=${form.adult}&room=${form.room}&children=${form.children}&startDate=${date[0].startDate}&endDate=${date[0].endDate}`
  );
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  function handlerChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                name="city"
                onChange={handlerChange}
                placeholder={destination}
                type="text"
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    name="min"
                    onChange={handlerChange}
                    type="number"
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    name="max"
                    onChange={handlerChange}
                    type="number"
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    onChange={handlerChange}
                    className="lsOptionInput"
                    placeholder={options.adult}
                    name="adult"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    onChange={handlerChange}
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                    name="children"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    onChange={handlerChange}
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                    name="room"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                reFetch();
              }}
            >
              Search
            </button>
          </div>
          <div className="listResult">
            {isLoading && (
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
            )}
            {data &&
              data.length > 0 &&
              data.map((hotel) => (
                <SearchItem
                  date={date}
                  options={options}
                  data={hotel}
                  key={hotel._id}
                />
              ))}
            {!data && !isLoading && <span>Not found hotel</span>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
