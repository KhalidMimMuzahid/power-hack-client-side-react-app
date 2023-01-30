import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { MyContext } from "../../contexts/MyProvider/MyProvider";
import Loader from "../../Pages/Component/Loader";

const PrivetRoute = ({ children }) => {
  const location = useLocation();
  const { currentUser, isLoading } = useContext(MyContext);
  //   console.log("isLoading privet", isLoading);
  if (isLoading) {
    return <Loader />;
  }
  if (!currentUser?._id) {
    return (
      <Navigate to="/signin" state={{ from: location }} replace></Navigate>
    );
  }
  return children;
};

export default PrivetRoute;
