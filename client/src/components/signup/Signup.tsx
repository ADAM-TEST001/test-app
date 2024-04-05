import React, { useEffect, useState } from "react";
import "./Signup.css";
import { emailRegex, passwordRegex } from "../../utils/Regex";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Signup = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, []);

  const navigate = useNavigate();

  const [isLoading, setisLoading] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset errors
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSignup = async () => {
    let hasErrors = false;

    if (!userDetails.name) {
      setErrors((prev) => ({
        ...prev,
        name: true,
      }));
      hasErrors = true;
      toast.error("Name is required");
    }

    if (!emailRegex.test(userDetails.email)) {
      setErrors((prev) => ({
        ...prev,
        email: true,
      }));
      hasErrors = true;
      toast.error("Please enter a valid email address");
    }

    if (!passwordRegex.test(userDetails.password)) {
      setErrors((prev) => ({
        ...prev,
        password: true,
      }));
      hasErrors = true;
      toast.error("Please enter a valid password");
    }

    if (!hasErrors) {
      //console.log(userDetails);

      setisLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/user/register-user",
          { userDetails }
        );
        setisLoading(false);
        //console.log(response);
        toast.success(response.data.message);
        navigate("/");
      } catch (error: any) {
        setisLoading(false);
        //console.log(error.response.data);
        toast.error(error.response.data.error) || "Something went wrong";
      }
    }
  };

  const [showPassword, setshowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      }}
      className="cont"
    >
      <div className="login-container">
        <h1>SIGN UP...</h1>
        {/* <div> */}
        <div className="formInput">
          <input
            style={{ width: "100%" }}
            className="input-field"
            placeholder="Name"
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInput}
          />
        </div>
        {/* {errors.name && <p className="error-message">Name is required</p>} */}
        <div className="formInput">
          <input
            style={{ width: "100%" }}
            className="input-field"
            placeholder="Email"
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInput}
          />
        </div>
        {/* {errors.email && <p className="error-message">Invalid email</p>} */}
        <div className="formInput" style={{ position: "relative" }}>
          <input
            style={{ width: "100%" }}
            className="input-field"
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={userDetails.password}
            onChange={handleInput}
          />
          <button
            style={{
              position: "absolute",
              top: "25%",
              right: "12px",
              width: "50px",
              height: "50%",
              outline: "none",
              border: "none",
              cursor: "pointer",
              color: "black",
              background: "white",
            }}
            onClick={() => {
              setshowPassword(!showPassword);
            }}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
        {/* {errors.password && (
        <p className="error-message">
          Password must be at least 8 characters long and contain at least one
          uppercase letter, one lowercase letter, and one number
        </p>
      )} */}
        {/* </div> */}

        <button className="login-button" onClick={handleSignup}>
          {!isLoading ? "SIGN UP" : <span className="loader"></span>}
        </button>
        <p>
          Already have an account{" "}
          <span>
            <Link to="/">Login</Link>
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
