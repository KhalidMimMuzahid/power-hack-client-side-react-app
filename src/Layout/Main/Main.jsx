import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import MyProvider, { MyContext } from "../../contexts/MyProvider/MyProvider";
import Loader from "../../Pages/Component/Loader";
import Footer from "../../Pages/shared/Footer/Footer";
import Navbar from "../../Pages/shared/Navbar/Navbar";

const Main = () => {
  const { isLoading } = useContext(MyContext);
  console.log("isLoading privet", isLoading);
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
