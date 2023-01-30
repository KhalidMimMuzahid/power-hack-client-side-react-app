import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../../contexts/MyProvider/MyProvider";

const Navbar = () => {
  const { currentUser, logOut, paidTotal } = useContext(MyContext);
  return (
    <div class="bg-gray-900">
      <div class="px-4 py-5 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div class="relative flex items-center justify-between">
          <div class="flex items-center">
            <Link
              to="/"
              aria-label="Company"
              title="Company"
              class="inline-flex items-center mr-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-12 h-12 text-white"
              >
                <path
                  fill-rule="evenodd"
                  d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              <h1 className="font-medium text-white hidden md:inline ml-4">
                Home
              </h1>
            </Link>
            <ul class="flex items-center  space-x-8 lg:flex">
              <li>
                <Link
                  to="/billings"
                  aria-label="Our product"
                  title="Our product"
                  class="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400"
                >
                  Billings
                </Link>
              </li>
            </ul>
          </div>
          <ul class="flex items-center  space-x-8 lg:flex">
            {currentUser && currentUser?._id ? (
              <>
                <li>
                  <h1 className="text-white font-bold">
                    Paid Total: {paidTotal ? paidTotal : "00"} $
                  </h1>
                </li>
                <li className="hidden md:block">
                  <h1 className="text-white font-bold">{currentUser?.name}</h1>
                </li>
                <li>
                  <button
                    onClick={() => logOut()}
                    aria-label="Sign in"
                    title="Sign in"
                    class=" font-bold tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/signin"
                  aria-label="Sign in"
                  title="Sign in"
                  class="font-medium tracking-wide text-gray-100 transition-colors duration-200 hover:text-teal-accent-400"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
