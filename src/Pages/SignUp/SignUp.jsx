import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../contexts/MyProvider/MyProvider";
import Loader from "../Component/Loader";

const SignUp = () => {
  const { createUserWithEmail, setCurrentUser } = useContext(MyContext);
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [emailPasswordSignUpError, setEmailPasswordSignUpError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const signUpFormSubmit = (data) => {
    setEmailPasswordSignUpError("");
    // console.log(data);
    if (data.password !== data.confirmPassword) {
      setPasswordError("password should be match");
      alert("your provided password are not match");
      return;
    }
    setIsSignUpLoading(true);
    // retrive data from user input form
    const name = data?.name;
    const email = data?.email;
    const password = data?.password;
    // console.log(name, email, password);
    // create user to database
    createUserWithEmail(name, email, password)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data?.error) {
          setEmailPasswordSignUpError(data?.error);
          setIsSignUpLoading(false);
          return;
        } else if (data?.acknowledged && data?.token) {
          // user created succesfully
          const currentUser = { name, email, _id: data?.insertedId };
          // console.log("currentUser:", currentUser);
          setCurrentUser(currentUser);
          localStorage.setItem("accessToken", data.token);
          setIsSignUpLoading(false);
          toast.success("user created successfully");
          navigate("/");
        }
      });
  };
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log(value, name, type);
      // console.log("value", value);
      // console.log("name", name);
      // console.log("type", type);
      // console.log(
      //   "value?.password: ",
      //   value?.password,
      //   "value?.confirmPassword:",
      //   value?.confirmPassword,
      //   "passwordError:",
      //   passwordError
      // );
      if (value?.password === value?.confirmPassword) {
        setPasswordError("");
      } else {
        setPasswordError("password should be match");
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div>
      <div>
        <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
          <div>
            <h3 className="text-4xl font-bold text-gray-900">Power_Hack</h3>
          </div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
            <form onSubmit={handleSubmit(signUpFormSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("name", {
                      required: { value: true, message: "Name is required" },
                      maxLength: {
                        value: 20,
                        message: "Max length cann't be more than 20 character",
                      },
                    })}
                    type="text"
                    name="name"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.name && (
                  <p role="alert" className="text-red-500 font-bold">
                    {/* Name is required */}
                    {errors?.name?.message}
                  </p>
                )}
              </div>
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
              <div className="mt-4">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Confirm Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    {...register("confirmPassword", {
                      required: {
                        value: true,
                        message: "Please confirm your password",
                      },
                    })}
                    type="password"
                    name="confirmPassword"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                {errors?.confirmPassword && (
                  <p role="alert" className="text-red-500 font-bold">
                    {errors?.confirmPassword?.message}
                  </p>
                )}
                {passwordError && !errors?.confirmPassword && (
                  <p role="alert" className="text-red-500 font-bold">
                    {passwordError}
                  </p>
                )}
              </div>
              <div className="flex items-center mt-4">
                <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform gray-900 rounded-md  hover:bg-gray-800 focus:outline-none focus:bg-gray-600">
                  Register
                </button>
              </div>
              {emailPasswordSignUpError && (
                <p role="alert" className="text-red-500 font-bold">
                  {emailPasswordSignUpError}
                </p>
              )}

              {isSignUpLoading && (
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
              Already have an account?{" "}
              <span>
                <Link
                  className="text-gray-900 hover:underline font-bold"
                  to="/signin"
                >
                  Go to signIn
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
