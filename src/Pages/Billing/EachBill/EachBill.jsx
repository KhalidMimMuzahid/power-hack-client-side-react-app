import React, { useContext } from "react";
import { toast } from "react-toastify";
import { MyContext } from "../../../contexts/MyProvider/MyProvider";

const EachBill = ({
  eachBill,
  refetch,
  setBillingModalIsOpen,
  reset,
  setBillingModalInfo,
  setActionType,
}) => {
  const { setRefreshToggle } = useContext(MyContext);
  const { name, email, amount, _id, phone } = eachBill;
  const handleDeleteBill = () => {
    fetch(`https://job-task-mu.vercel.app/delete-billing/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Barerer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.deletedCount === 1) {
          toast.success("bill deleted successfully");
          refetch();
          setRefreshToggle((prev) => !prev);
        } else {
          toast.error("No documents matched the query. Deleted 0 documents.");
          setRefreshToggle((prev) => !prev);
        }
      });
  };
  return (
    <>
      <div className="border col-span-2 col-span text-center bg-gray-600 text-white py-1 ">
        {_id}
      </div>
      <div className="border col-span-2 text-center  bg-gray-700  text-white py-1 ">
        {name}
      </div>
      <div className="border col-span-2 text-center bg-gray-600 text-white py-1">
        {email}
      </div>
      <div className="border col-span-2 text-center  bg-gray-700  text-white py-1 ">
        {phone}
      </div>
      <div className="border col-span-2 text-center bg-gray-600 text-white py-1">
        {amount}
      </div>
      <div className="border col-span-2 text-center  bg-gray-700  text-white  flex justify-around py-0 items-center">
        <label
          htmlFor="billingModal"
          onClick={() => {
            setBillingModalIsOpen(true);
            reset();
            setBillingModalInfo(eachBill);
            setActionType("Update");
          }}
          className="grow btn btn-xs hover:font-bold hover:bg-slate-900 my-0"
        >
          Edit
        </label>{" "}
        |{" "}
        <h1
          onClick={handleDeleteBill}
          className="grow btn btn-xs hover:font-bold hover:bg-slate-900 my-0"
        >
          Delete
        </h1>
      </div>
    </>
  );
};

export default EachBill;
