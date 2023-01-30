import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main/Main";
import Billing from "../Pages/Billing/Billing";
import Home from "../Pages/Home/Home";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp";
import PrivetRoute from "./privetRoute/privetRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/billings",
        element: (
          <PrivetRoute>
            <Billing />
          </PrivetRoute>
        ),
      },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
    ],
  },
]);
