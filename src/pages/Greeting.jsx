import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/todoListLogo.png";
// import Settings from "../components/Settings";
import { MdCancel } from "react-icons/md";
import { FaBarsStaggered } from "react-icons/fa6";

const getGreeting = () => {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 12) {
    return "Good Morning";
  } else if (hours < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
};

const formatDate = (date) => {
  const options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
const formatDateNum = (date) => {
  const options = {
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
const formatMonth = (date) => {
  const options = {
    month: "long",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const Greeting = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [greeting, setGreeting] = useState(getGreeting());
  const [userData, setUserData] = useState(null);
  const [dailyQuote, setDailyQuote] = useState("");
  const [visible, setVisible] = useState(false);

  const toggleSettings = () => {
    setVisible(!visible);
  };

  let navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
      setGreeting(getGreeting());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/todoList/login");
      return;
    }

    const url = "https://todolist-server-api.onrender.com/todoList/todos";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => {
        if (res.data.status === true) {
          console.log("Full user data:", res.data.user);
          setUserData(res.data.user);

          const displayName =
            res.data.user.displayName || res.data.user?.profile?.displayName;
          console.log("User displayName:", displayName);
        } else {
          localStorage.removeItem("token");
          navigate("/todoList/login");
          console.log("Failed to authenticate, redirecting to login.");
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        navigate("/todoList/login");
        console.error("Error fetching user data:", err);
      });
  }, [navigate]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(
          "https://todolist-server-api.onrender.com/todoList/quote"
        );
        const data = await response.json();
        setDailyQuote(data[0].q);
      } catch (error) {
        console.error("Failed to fetch the daily quote", error);
      }
    };

    fetchQuote();
  }, []);
  const changePassword = () => {
    localStorage.removeItem("token");
    navigate("/todoList/forgotPassword");
  };
  const switchAccount = () => {
    localStorage.removeItem("token");
    navigate("/todoList/login");
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/todoList/login");
    window.location.reload();
    toast.success("Logout successful!");
  };

  return (
    <div className="greeting-page">
      <div className={`settings ${visible ? "visible" : ""}`}>
        {/* <button onClick={handleCancelClick}></button> */}
        <button onClick={toggleSettings}>
          {visible ? (
            <MdCancel className="cancel" />
          ) : (
            <FaBarsStaggered className="bars" />
          )}
        </button>
        <div className="profile">
          <div>
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="mt-[0px] uppercase font-extrabold text-[20px]">
            {userData ? (
              <div>{`${userData?.lastName || userData.email || "User"} ${
                userData?.firstName
              }`}</div>
            ) : (
              <div>{`User`}</div>
            )}
          </div>
        </div>
        <div className="mt-5">
          <details open>
            <summary>Settings</summary>
            <h3
              className="cursor-pointer text-gray-500"
              onClick={changePassword}
            >
              Change Password
            </h3>
            <h3
              className="cursor-pointer text-gray-500"
              onClick={switchAccount}
            >
              Switch Account
            </h3>
          </details>
        </div>
        <div>
          <details open>
            <summary>TODOS</summary>
            <h3>
              <NavLink to="/todoList/todo-list">My Todos</NavLink>
            </h3>
            <h3 className="text-gray-500 cursor-not-allowed hover:disabled:text-gray-500">
              Completed Todos
            </h3>
          </details>
          <h3>
            <NavLink to="/todoList/upload">My Files</NavLink>
          </h3>
        </div>
        <button className="logout-btn rounded-full" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="greetings">
        <div className="profile">
          <button onClick={toggleSettings}>
            {visible ? (
              <MdCancel className="cancel" />
            ) : (
              <FaBarsStaggered className="bars" />
            )}
          </button>
          <div>
            <img src={logo} alt="Logo" className="logo" />
          </div>
          {/* <div className="mt-[0px] uppercase font-extrabold text-[20px] text-center">
      {userData ? (
        <div>{`${userData?.lastName || userData.email || "User"} ${userData?.firstName}`}</div>
      ) : (
        <div>{`User`}</div>
      )}
    </div> */}
        </div>
        <div className="greeting">
          <div className="greeting-text">
            {userData ? (
              <p className="greeting-text text-center">{`${greeting}, ${
                userData?.firstName || userData.email || "User"
              }`}</p>
            ) : (
              <p className="greeting-text text-center">{`${greeting}, User`}</p>
            )}
          </div>
          <p className="greeting-quote">" {dailyQuote}"</p>
        </div>
        <div className="greeting-date mt-2">
          <p className="text-center lg:text-[20px] text-neutral-300 font-extrabold">
            {formatDate(currentDate)}
          </p>
          <p className="text-center font-extrabold lg:text-3xl">
            {formatDateNum(currentDate)}
          </p>
          <p className="text-center lg:text-[20px] text-neutral-300 font-extrabold">
            {formatMonth(currentDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
