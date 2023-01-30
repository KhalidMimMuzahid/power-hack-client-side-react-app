import React from "react";
import { Link } from "react-router-dom";
import powerSupply from "../../../Assets/images/powerSupply.jpg";
const AboutUs = () => {
  return (
    <div
      className="  min-h-full px-8 lg:px-0 mx-4 mt-[100px] md:mt-[150px] "
      id="about-us"
    >
      <div className="z-0 flex items-center justify-center w-auto gap-12 p-4 px-0 flex-col lg:flex-row ">
        <img
          alt=""
          src={powerSupply}
          className="max-w-md rounded-lg shadow-2xl hidden lg:block"
        />
        <div className="">
          <h1 className="text-5xl font-bold">About Us</h1>
          <p className="py-6 text-justify">
            <span className="font-bold">Introduction:</span>
            Currently, the electricity situation in our country is very bad.
            Electricity goes out all day, so as an extra backup we should keep
            reserved electricity and our company is providing extra collected
            electricity. If you want you can pay your electricity bill through
            our site. Click the below button to pay the electricity bill
          </p>

          <Link to="billings" className="btn btn-primary my-8">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
