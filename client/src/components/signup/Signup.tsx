import React, { useEffect, useState } from "react";
import "./Signup.css";
import { emailRegex, passwordRegex } from "../../utils/Regex";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, []);

  const navigate = useNavigate();

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
    }

    if (!emailRegex.test(userDetails.email)) {
      setErrors((prev) => ({
        ...prev,
        email: true,
      }));
      hasErrors = true;
    }

    if (!passwordRegex.test(userDetails.password)) {
      setErrors((prev) => ({
        ...prev,
        password: true,
      }));
      hasErrors = true;
    }

    if (!hasErrors) {
      console.log(userDetails);

      const response = await axios.post(
        "http://localhost:5000/user/register-user",
        { userDetails }
      );

      console.log(response);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <div>
        <input
          className={errors.name ? "error" : ""}
          placeholder="Name"
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleInput}
        />
        {errors.name && <p className="error-message">Name is required</p>}
        <input
          className={errors.email ? "error" : ""}
          placeholder="Email"
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInput}
        />
        {errors.email && <p className="error-message">Invalid email</p>}
        <input
          className={errors.password ? "error" : ""}
          placeholder="Password"
          type="password"
          name="password"
          value={userDetails.password}
          onChange={handleInput}
        />
        {errors.password && (
          <p className="error-message">
            Password must be at least 8 characters long and contain at least one
            uppercase letter, one lowercase letter, and one number
          </p>
        )}
      </div>
      <div className="btn-container">
        <button onClick={handleSignup}>Signup</button>
      </div>
      <p>
        Already have an account{" "}
        <span>
          <Link to="/">Login</Link>
        </span>
      </p>
    </div>
  );
};

export default Signup;
