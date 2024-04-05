import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { RiEdit2Line } from "react-icons/ri";

import "./Home.css";

interface User {
  email: string;
  name: string;
}

const Home = () => {
  const [userDetails, setUserDetails] = useState<User>(
    jwtDecode(localStorage.getItem("token")!)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [toUpdate, setToUpdate] = useState<string | null>(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    toast.success("User logged out");
    navigate("/");
  };

  const handleUpdate = async () => {
    if (toUpdate === "name" && !updatedValue.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (toUpdate === "password" && !passwordUpdate.trim()) {
      toast.error("Password cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        updateType: toUpdate!,
        userDetails: {
          email: userDetails.email,
          [toUpdate === "name" ? "name" : "password"]:
            toUpdate === "name" ? updatedValue.trim() : passwordUpdate.trim(),
        },
      };

      const header = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/updateDetails`,
        payload,
        { headers: header }
      );

      toast.success(
        `${toUpdate === "name" ? "Username" : "Password"} updated successfully`
      );
      setIsLoading(false);
      setToUpdate(null);
      setUpdatedValue("");
      setPasswordUpdate("");
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="main">
      <nav className="navbar">
        <span>Welcome</span>
        <button className="logout" onClick={logout}>
          LOGOUT
        </button>
      </nav>
      <div className="mainCont">
        <div className="card">
          <div className="userDetails">
            <p>
              Name:{" "}
              {toUpdate === "name" ? (
                <>
                  <input
                    type="text"
                    value={updatedValue}
                    onChange={(e) => setUpdatedValue(e.target.value)}
                    autoFocus
                  />
                  <button onClick={handleUpdate}>Save</button>
                </>
              ) : (
                <>
                  {userDetails.name}
                  <RiEdit2Line
                    onClick={() => setToUpdate("name")}
                    className="editIcon"
                  />
                </>
              )}
            </p>
            <p>Email: {userDetails.email}</p>
          </div>
          <div className="userDetails">
            <p>
              Password:{" "}
              {toUpdate === "password" ? (
                <>
                  <input
                    type="password"
                    value={passwordUpdate}
                    onChange={(e) => setPasswordUpdate(e.target.value)}
                    autoFocus
                  />
                  <button onClick={handleUpdate}>Save</button>
                </>
              ) : (
                <>
                  ********
                  <RiEdit2Line
                    onClick={() => setToUpdate("password")}
                    className="editIcon"
                  />
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
