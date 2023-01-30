import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../contexts/MyProvider/MyProvider";
import Loader from "../Component/Loader";
import EachBill from "./EachBill/EachBill";

const Billing = () => {
  const { currentUser, logOut, setPaidTotal, setRefreshToggle } =
    useContext(MyContext);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [allBills, setAllBills] = useState([]);
  const [totalBills, setTotalBills] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [searchType, setSearchType] = useState("");
  const [billingModalIsOpen, setBillingModalIsOpen] = useState(false);
  const [billingModalInfo, setBillingModalInfo] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [size, setSize] = useState(10);
  const pages = Math.ceil(totalBills / size);
  const handleBillingFormSubmit = (data) => {
    setIsSubmitting(true);
    const { name, email, amount: amountString, phone } = data;
    const amount = parseInt(amountString);
    if (isNaN(amount)) {
      alert("please enter a valid amount");
    }
    // console.log(data);
    const today = moment().format();
    const bill = {
      name,
      email,
      amount,
      phone,
      date: today,
      authorityEmail: currentUser?.email,
    };

    if (actionType === "Add New") {
      setTotalBills((prev) => prev + 1);
      setPaidTotal((prev) => prev + amount);
      const newBill = { ...bill };
      newBill._id = "generating...";
      const newAllBills = [newBill, ...allBills];
      newAllBills.length = size;
      setAllBills(newAllBills);
      fetch("https://job-task-mu.vercel.app/add-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Barerer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ bill }),
      })
        .then((res) => {
          if (res.satus === 401 || res.status === 403) {
            logOut();
            localStorage.removeItem("accessToken");
          }
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          if (data?.acknowledged) {
            toast.success("bill added succesfully");
            reset();
            setIsSubmitting(false);
            setBillingModalIsOpen(false);

            refetch();
            setRefreshToggle((prev) => !prev);
          } else {
            toast.error("something went wrong. please try again later");
            refetch();
            setRefreshToggle((prev) => !prev);
            setIsSubmitting(false);
          }
        });
    } else if (actionType === "Update") {
      // billingModalInfo
      // console.log("xxxx", name, email, amount, phone);
      const updateBillInfo = { name, email, amount, phone };
      setAllBills((prevAllBills) => {
        const newAllBills = prevAllBills.map((eachBill) => {
          if (eachBill._id === billingModalInfo?._id) {
            const updatedBill = { ...eachBill };
            updatedBill.name = name;
            updatedBill.email = email;
            updatedBill.amount = amount;
            updatedBill.phone = phone;
            return updatedBill;
          }
          return eachBill;
        });
        return newAllBills;
      });

      setPaidTotal((prev) => prev + (amount - billingModalInfo?.amount));
      fetch(
        `https://job-task-mu.vercel.app/update-billing/${billingModalInfo?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Barerer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(updateBillInfo),
        }
      )
        .then((res) => {
          if (res.satus === 401 || res.status === 403) {
            logOut();
            localStorage.removeItem("accessToken");
          }
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          if (data?.modifiedCount) {
            toast.success("bill updated successfully");
            reset();
            setIsSubmitting(false);
            setBillingModalIsOpen(false);
            setRefreshToggle((prev) => !prev);
            refetch();
          } else {
            toast.error("something went wrong. please try again later");
            refetch();
            setRefreshToggle((prev) => !prev);
            setIsSubmitting(false);
          }
        });
    }
  };
  const {
    data = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [pageNo, size, searchKey, searchType],
    queryFn: async () => {
      const res = await fetch(
        `https://job-task-mu.vercel.app/billing-list?pageNo=${pageNo}&size=${size}&searchKey=${searchKey}&searchType=${searchType}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Barerer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (res.satus === 401 || res.status === 403) {
        logOut();
        localStorage.removeItem("accessToken");
      }
      const data = await res.json();
      console.log(data);
      setTotalBills(data?.totalBills);
      setAllBills(data?.bills);

      return data?.bills;
    },
  });
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    // const "searchKey" searchType
    const searchKeyField = e.target?.searchKey;
    const searchTypeField = e.target?.searchType;
    const searchKeyString = searchKeyField?.value;
    const searchTypeString = searchTypeField?.value;
    console.log(searchKeyString, ":::", searchTypeString);
    setSearchKey(searchKeyString);
    setSearchType(searchTypeString);
    e.target.reset();
  };
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="mx-0 md:mx-1 lg:mx-12 mt-12">
      <div className=" w-full bg-slate-900 py-2 px-1 md:px-4 lg:px-6">
        <div className="flex justify-between">
          <div className="flex grow justify-between">
            <h1 className=" hidden md:flex items-center text-white font-bold md:text-lg lg:text-xl">
              Billings
            </h1>

            <div className="mr-12">
              <form onSubmit={handleSearchFormSubmit}>
                <div class="flex">
                  <select
                    name="searchType"
                    className=" pl-2  max-w-xs text-sm  text-gray-900 bg-gray-50 rounded-l-lg border-r-2"
                  >
                    <option value="name" selected>
                      Full Name
                    </option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                  <div class="relative w-full">
                    <input
                      type="search"
                      name="searchKey"
                      id="search-dropdown"
                      class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                      placeholder="type here..."
                    />
                    <button
                      type="submit"
                      class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                      <span class="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="flex items-center">
            <label
              htmlFor="billingModal"
              onClick={() => {
                setBillingModalIsOpen(true);
                reset();
                setBillingModalInfo(null);
                setActionType("Add New");
              }}
              className="btn bg-white text-sm md:text-lg px-0 md:px-2 text-black btn-sm h-[42px] font-bold hover:bg-slate-400 "
            >
              add new
            </label>
          </div>
        </div>
      </div>
      {/* searchKey, setSearchKey] = useState("");
  const [searchType */}
      <div className="mt-4">
        {allBills.length === 0 ? (
          <div className="flex justify-center my-2">
            <h1 className="text-lg font-bold">
              No Bills Here
              {searchKey.length !== 0 &&
                searchType.length !== 0 &&
                ` | Where, ${searchType}=${searchKey}`}
            </h1>
          </div>
        ) : (
          <div className="flex justify-center my-2">
            <h1 className="text-lg font-bold">
              total bills: {totalBills}{" "}
              {searchKey.length !== 0 &&
                searchType.length !== 0 &&
                ` | Where, ${searchType}=${searchKey}`}
            </h1>
          </div>
        )}
      </div>
      <div>
        <div className="grid grid-cols-12">
          <>
            <div className="border col-span-2 text-center bg-gray-700 text-white py-3 font-bold">
              Billing ID
            </div>
            <div className="border col-span-2 text-center  bg-gray-800  text-white py-3  font-bold">
              Full Name
            </div>
            <div className="border col-span-2 text-center bg-gray-700 text-white py-3 font-bold">
              Email
            </div>
            <div className="border col-span-2 text-center  bg-gray-800  text-white py-3  font-bold">
              Phone
            </div>
            <div className="border col-span-2 text-center bg-gray-700 text-white py-3 font-bold">
              Paid Amount
            </div>
            <div className="border col-span-2 text-center  bg-gray-800  text-white py-3  font-bold">
              Action
            </div>
          </>
          {allBills?.length !== 0 &&
            allBills.map((eachBill) => (
              <EachBill
                setActionType={setActionType}
                setBillingModalInfo={setBillingModalInfo}
                reset={reset}
                setBillingModalIsOpen={setBillingModalIsOpen}
                key={eachBill?._id}
                eachBill={eachBill}
                refetch={refetch}
              />
            ))}
        </div>
      </div>

      <div className="flex justify-center my-4">
        <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 sm:flex">
          <span className="block text-lg ">
            Page {pages === 0 ? "0" : pageNo + 1} of {pages}
          </span>
          <div className="space-x-1">
            <button
              disabled={pages === 1 || pageNo === 0}
              onClick={() => setPageNo((prev) => prev - 1)}
              title="previous"
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
            >
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              disabled={pages === 1 || pageNo + 1 === pages}
              onClick={() => setPageNo((prev) => prev + 1)}
              title="next"
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow"
            >
              <svg
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div>
            <select
              className="select select-bordered select-sm  w-full max-w-xs"
              onChange={(e) => {
                setPageNo(0);
                setSize(parseInt(e.target.value));
              }}
            >
              <option disabled selected>
                select size
              </option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>

      {billingModalIsOpen && (
        <>
          <input type="checkbox" id="billingModal" className="modal-toggle" />
          <div className="modal modal-bottom sm:modal-middle ">
            <div className="modal-box pb-32 sm:pb-2">
              <label
                htmlFor="billingModal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <h1 className="text-lg font-bold text-center">
                {actionType} Bill
              </h1>
              <form onSubmit={handleSubmit(handleBillingFormSubmit)}>
                <div>
                  <label
                    htmlFor="name"
                    className=" block sm:text-lg font-bold my-2"
                  >
                    Name
                  </label>

                  <input
                    {...register("name", {
                      required: {
                        value: true,
                        message: "you must provide the customer name",
                      },
                      maxLength: {
                        value: 20,
                        message: "Max length cann't be more than 20 character",
                      },
                    })}
                    type="text"
                    id="name"
                    className="w-full border px-2 py-2 text-black"
                    placeholder="customer name"
                    defaultValue={billingModalInfo?.name}
                  ></input>
                  {errors?.name && (
                    <p role="alert" className="text-red-500 font-bold">
                      {errors?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className=" block sm:text-lg font-bold my-2"
                  >
                    Email
                  </label>

                  <input
                    {...register("email", {
                      required: {
                        value: true,
                        message: "you must provide the customer email",
                      },
                    })}
                    type="email"
                    id="email"
                    className="w-full border px-2 py-2 text-black"
                    placeholder="customer email"
                    defaultValue={billingModalInfo?.email}
                  ></input>
                  {errors?.email && (
                    <p role="alert" className="text-red-500 font-bold">
                      {errors?.email?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className=" block sm:text-lg font-bold my-2"
                  >
                    Phone
                  </label>

                  <input
                    {...register("phone", {
                      required: {
                        value: true,
                        message: "you must provide the customer phone",
                      },
                      pattern: { value: /[0-9]/, message: "invalid input" },
                      maxLength: {
                        value: 15,
                        message:
                          "number should not contain more than 15 character",
                      },
                    })}
                    type="number"
                    id="phone"
                    className="w-full border px-2 py-2 text-black"
                    placeholder="customer phone"
                    defaultValue={billingModalInfo?.phone}
                  ></input>
                  {errors?.phone && (
                    <p role="alert" className="text-red-500 font-bold">
                      {errors?.phone?.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="amount"
                    className=" block sm:text-lg font-bold my-2"
                  >
                    Amount
                  </label>

                  <input
                    {...register("amount", {
                      required: {
                        value: true,
                        message: "you must provide amount",
                      },
                      min: { value: 1, message: "invalid input" },
                      max: {
                        value: 99999999999,
                        message: "This amount is too much",
                      },
                      pattern: { value: /[0-9]/, message: "invalid input" },
                    })}
                    type="number"
                    id="amount"
                    className="w-full border px-2 py-2 text-black"
                    placeholder="amount"
                    defaultValue={billingModalInfo?.amount}
                  ></input>
                  {errors?.amount && (
                    <p role="alert" className="text-red-500 font-bold">
                      {errors?.amount?.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn w-full my-2"
                  disabled={isSubmitting}
                >
                  {actionType}
                </button>
              </form>
              {isSubmitting && <Loader type="progressor" />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Billing;
