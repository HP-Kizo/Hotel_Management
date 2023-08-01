import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import useFetch from "../../components/context/useFetch";
import { useState, useEffect } from "react";
import "./home.css";

const Home = () => {
  const [dataHotel, setDataHotel] = useState({});
  const { data, isLoading, error, reFetch } = useFetch(`/hotels/getHotel`);
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);
  return (
    <>
      <Navbar />
      {isLoading && (
        <div className="loader">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
          <div className="bar4"></div>
          <div className="bar5"></div>
          <div className="bar6"></div>
          <div className="bar7"></div>
          <div className="bar8"></div>
          <div className="bar9"></div>
          <div className="bar10"></div>
          <div className="bar11"></div>
          <div className="bar12"></div>
        </div>
      )}
      {data && (
        <>
          <Header />
          <div className="homeContainer">
            <Featured dataHotel={data} />
            <h1 className="homeTitle">Browse by property type</h1>
            <PropertyList dataHotel={data} />
            <h1 className="homeTitle">Homes guests love</h1>
            <FeaturedProperties dataHotel={data} />
            <MailList />
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
