import React, { createContext, useEffect, useState } from "react";

export const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paidTotal, setPaidTotal] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  useEffect(() => {
    fetch("https://job-task-mu.vercel.app/checkCurrentUser", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Barerer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => {
        if (res.status === 403) {
          logOut();
          setCurrentUser(null);
          setIsLoading(false);
        }
        return res.json();
      })
      .then((data) => {
        setIsLoading(false);
        setCurrentUser(data?.currentUser);
        setPaidTotal(data?.paidTotal);
      });
  }, [refreshToggle]);
  const emailPasswordSignIn = (email, password) => {
    return fetch("https://job-task-mu.vercel.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  };
  const createUserWithEmail = (name, email, password) => {
    return fetch("https://job-task-mu.vercel.app/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  };

  const logOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("accessToken");
  };

  const info = {
    isLoading,
    currentUser,
    setCurrentUser,
    emailPasswordSignIn,
    createUserWithEmail,
    logOut,
    paidTotal,
    setPaidTotal,
    setRefreshToggle,
  };
  return <MyContext.Provider value={info}>{children}</MyContext.Provider>;
};

export default MyProvider;
