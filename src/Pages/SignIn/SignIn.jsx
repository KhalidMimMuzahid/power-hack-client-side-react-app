import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../contexts/MyProvider/MyProvider";
import Loader from "../Component/Loader";
const SignIn = () => {
  const { emailPasswordSignIn, setCurrentUser } = useContext(MyContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  console.log("path:", from);
  //   const [passwordError, setPasswordError] = useState("");
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [emailPasswordSignInError, setEmailPasswordSignInError] = useState("");

  const signInFormSubmit = (data) => {
    setEmailPasswordSignInError("");
    // console.log(data);
    // retrive data from user input form
    const { email, password } = data;
    setIsSignInLoading(true);

    // login user
    emailPasswordSignIn(email, password)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data?.error) {
          setIsSignInLoading(false);
          setEmailPasswordSignInError(data?.error);
        } else if (data && data?.token) {
          // user created succesfully

          const currentUser = {
            name: data?.name,
            email: data?.email,
            _id: data?._id,
          };
          // console.log("currentUser:", currentUser);
          setCurrentUser(currentUser);
          localStorage.setItem("accessToken", data.token);
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 100);
        }
      });
  };
  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
          <div>
            <h3 className="text-4xl font-bold text-primary">Power_Hack</h3>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
            <form onSubmit={handleSubmit(signInFormSubmit)}>
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Email
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    name="email"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.email && (
                  <p role="alert" className="text-red-500 font-bold">
                    {errors?.email?.message}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Please enter your password",
                      },
                      maxLength: {
                        value: 8,
                        message: "Password can't be more than 8 characters",
                      },
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type="password"
                    name="password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.password && (
                  <p role="alert" className="text-red-500 font-bold">
                    {/* Name is required */}
                    {errors?.password?.message}
                  </p>
                )}
              </div>

              <div className="flex items-center mt-4">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-primary rounded-md hover:bg-blue-800 bg-blue-700 focus:outline-none focus:bg-blue-600">
                  Sign In
                </button>
              </div>
              {emailPasswordSignInError && (
                <p role="alert" className="text-red-500 font-bold">
                  {emailPasswordSignInError}
                </p>
              )}

              {isSignInLoading && (
                <>
                  <Loader type="" />
                  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                      {/*content*/}

                      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {" "}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-25 fixed inset-0 z-40 bg-black">
                    {" "}
                  </div>
                </>
              )}
            </form>

            <div className="mt-4 text-grey-600">
              New to Power_Hack?{" "}
              <span>
                <Link className="text-primary hover:underline" to="/signup">
                  Go to signUp
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
