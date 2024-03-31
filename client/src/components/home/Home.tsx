import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import "./Home.css";
import { useNavigate } from "react-router-dom";
import { emailRegex, passwordRegex } from "../../utils/Regex";
import toast from "react-hot-toast";
import axios from "axios";

interface User {
  email: string;
  name: string;
}

const Home = () => {
  const [userDetails, setUserDetails] = useState<User>(
    jwtDecode(localStorage.getItem("token")!)
  );

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    name: "",
    password: "",
  });

  const [toUpdate, setToupdate] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUpdatedUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    if (toUpdate === "username") {
      if (!updatedUserDetails.name) {
        toast.error("Username is empty");
        return;
      }

      const payload = {
        updateType: toUpdate,
        userDetails: {
          email: userDetails.email,
          name: updatedUserDetails.name,
        },
      };

      const header = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      try {
        const response = await axios.put(
          `${BASE_URL}/user/updateDetails`,
          payload,
          { headers: header }
        );

        toast.success("Username updated successfully");
        setToupdate("");
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!passwordRegex.test(updatedUserDetails.password)) {
        toast.error("Weak Password");

        return;
      }

      const payload = {
        updateType: toUpdate,
        userDetails: {
          email: userDetails.email,
          password: updatedUserDetails.password,
        },
      };

      const header = {
        Authorization: "Bearer " + localStorage.getItem("token"),
      };

      try {
        const response = await axios.put(
          `${BASE_URL}/user/updateDetails`,
          payload,
          { headers: header }
        );
        toast.success("Password updated successfully");

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (toUpdate === "") {
      getuser();
    }
  }, [toUpdate]);

  const getuser = async () => {
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    try {
      const response = await axios.post(`${BASE_URL}/user/userByEmail`, {
        email: userDetails.email,
      });

      setUserDetails((prev) => ({
        ...prev,
        name: response.data.name,
      }));
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="main">
      <nav className="navbar">
        <span>HELLO {userDetails.name}</span>
        <button className="logout" onClick={logout}>
          LOGOUT
        </button>
      </nav>

      <div className="mainContainer">
        <select
          value={toUpdate}
          onChange={(e) => {
            setToupdate(e.target.value);
          }}
        >
          <option value="" disabled selected>
            What to update ????
          </option>
          <option value="password">Update Password</option>
          <option value="username">Update Username</option>
        </select>

        <div className="editPannel">
          {toUpdate === "username" && (
            <div>
              <input
                placeholder="Update Username "
                type="name"
                name="name"
                value={updatedUserDetails.name}
                onChange={handleInput}
              />
            </div>
          )}
          {toUpdate === "password" && (
            <div>
              <input
                placeholder="Updated Password"
                type="password"
                name="password"
                value={updatedUserDetails.password}
                onChange={handleInput}
              />
            </div>
          )}

          {toUpdate && (
            <button onClick={handleUpdate} className="updateBtn">
              Update
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
