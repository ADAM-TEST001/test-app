import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { RiEdit2Line } from "react-icons/ri";

import "./Home.css";
import { passwordRegex } from "../../utils/Regex";

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
  const [originalName, setOriginalName] = useState("");
  const [originalPassword, setOriginalPassword] = useState("");

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    toast.success("User logged out");
    navigate("/");
  };

  const handleUpdate = async () => {
    if (
      (toUpdate === "name" && !updatedValue.trim()) ||
      (toUpdate === "password" && !updatedValue.trim())
    ) {
      toast.error("Field cannot be empty");
      return;
    }
    // console.log(passwordRegex.test(updatedValue.trim()));

    if (!passwordRegex.test(updatedValue.trim()) && toUpdate === "password") {
      toast.error(
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one digit."
      );
    }
    setIsLoading(true);

    try {
      const payload = {
        updateType: toUpdate!,
        userDetails: {
          email: userDetails.email,
          [toUpdate === "name" ? "name" : "password"]: updatedValue.trim(),
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
        `${toUpdate === "name" ? "Name" : "Password"} updated successfully`
      );

      // Automatically update the username or email
      if (toUpdate === "name") {
        await getUser();
      }

      setIsLoading(false);
      setToUpdate(null);
      setUpdatedValue("");
    } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/userByEmail`,
        {
          email: userDetails.email,
        }
      );

      setUserDetails((prev) => ({
        ...prev,
        name: response.data.name,
      }));
    } catch (error) {
      toast.error("Failed to update details");
    }
  };

  const handleCancel = () => {
    setToUpdate(null);
    setUpdatedValue("");
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
            <p style={{ display: "flex", alignItems: "center" }}>
              Name:{" "}
              {toUpdate === "name" ? (
                <>
                  <input
                    type="text"
                    value={updatedValue}
                    onChange={(e) => setUpdatedValue(e.target.value)}
                    autoFocus
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  {userDetails.name}
                  <RiEdit2Line
                    onClick={() => {
                      setOriginalName(userDetails.name);
                      setToUpdate("name");
                    }}
                    className="editIcon"
                  />
                </>
              )}
            </p>
          </div>
          <div className="userDetails">
            <p style={{ display: "flex", alignItems: "center" }}>
              Password:{" "}
              {toUpdate === "password" ? (
                <>
                  <input
                    type="password"
                    value={updatedValue}
                    onChange={(e) => setUpdatedValue(e.target.value)}
                    autoFocus
                    disabled={isLoading}
                  />
                  {isLoading ? (
                    <span className="loader"></span>
                  ) : (
                    <>
                      <button onClick={handleUpdate}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  )}
                </>
              ) : (
                <>
                  ********
                  <RiEdit2Line
                    onClick={() => {
                      setOriginalPassword("********");
                      setToUpdate("password");
                    }}
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
