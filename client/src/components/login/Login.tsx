import React, { useEffect, useState } from "react";
import "./Login.css";
import { emailRegex, passwordRegex } from "../../utils/Regex";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { LoginSocialFacebook, LoginSocialGoogle } from "reactjs-social-login";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import GoogleButton from "react-google-button";
import { motion } from "framer-motion";

interface JWTPayload {
  name: string;
  email: string;
  exp: string;
}

const Login = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, []);

  //console.log(import.meta.env);

  const [showPassword, setshowPassword] = useState(false);

  const [isLoading, setisLoading] = useState(false);

  const navigate = useNavigate();

  const [otp, setOtp] = useState<string>("");

  const [otpReceived, setOtpReceived] = useState(false);

  const [otpVerifed, setOtpVerified] = useState(false);

  const [userDetails, setUserDetails] = useState({ email: "", password: "" });

  const [isVerifed, setIsVerified] = useState(true);

  const [isRestPassword, setisRestPassword] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    setisLoading(true);

    if (!emailRegex.test(userDetails.email)) {
      //console.log("email is not a valid email");
      toast.error("Please enter a valid email");
      setisLoading(false);

      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      //console.log("password is not a valid password", userDetails.password);
      toast.error("Password is not a valid password");
      setisLoading(false);

      return;
    }

    const requestBody = {
      updateType: "password",
      userDetails,
    };

    const header = {
      Authorization: "VIA EMAIL",
    };
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/updateDetails`,
        requestBody,
        { headers: header }
      );

      //console.log(response);

      setisRestPassword(false);
      setOtp("");
      setOtpReceived(false);
      setOtpVerified(false);
      toast.success("User updated successfully");
      setisLoading(false);
    } catch (error: any) {
      toast.success(error.response.data);
      setisLoading(false);

      //console.log(error);
    }
  };

  const handleLogin = async () => {
    setisLoading(true);
    if (!emailRegex.test(userDetails.email)) {
      //console.log("email is not a valid email");
      setisLoading(false);
      toast.error("Email is not a valid email");
      return;
    }

    if (isRestPassword && otpReceived) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/verifyOTP`,
          { otp: otp }
        );

        //console.log(response);
        setOtpVerified(true);
        setUserDetails((prev) => ({
          ...prev,
          password: "",
        }));

        toast.success("OTP verified");
        setisLoading(false);
      } catch (error: any) {
        toast.error(error.response.data.message);
        //console.log(error);
        setisLoading(false);
      }

      return;
    }

    if (isRestPassword) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/user/resetPassword`,
          { email: userDetails.email }
        );

        //console.log(response);
        setOtpReceived(true);
        toast.success("OTP sent successfully");
        setisLoading(false);
      } catch (error: any) {
        toast.error(error.message);
        //console.log(error);
        setisLoading(false);
      }

      return;
    }

    if (!passwordRegex.test(userDetails.password)) {
      //console.log("password is not a valid password", userDetails.password);
      toast.error("Password is not a valid password");

      setisLoading(false);

      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/login-user`,
        { userDetails }
      );
      setisLoading(false);

      navigate("/home");

      localStorage.setItem("token", response.data.token);
      //console.log();
      localStorage.setItem(
        "exp",
        jwtDecode<JWTPayload>(localStorage.getItem("token")!).exp
      );

      const { name } = jwtDecode<JWTPayload>(localStorage.getItem("token")!);

      toast.success(`Hello ${name}`);
    } catch (error: any) {
      setisLoading(false);

      toast.error(error.response.data.error);

      //console.log(error.response.data.error);

      if (error.response.data.error === "User is not verified") {
        setIsVerified(false);
      }
    }
  };

  const getVerificationMail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/getVerificationEmail`,
        { email: userDetails.email }
      );

      //console.log(response.data);
      setIsVerified(true);
      toast.success("You are now verified");
      setisLoading(false);

      // setIsVerified(false);
    } catch (error) {
      toast.success("Something went wrong. Try again later");
      //console.log(error);
      setIsVerified(true);
      setisLoading(false);
    }
  };

  const resetPassword = async () => {
    setisRestPassword(true);
  };

  const handleGoogleLogin = async (e) => {
    console.log(e);

    // return;

    // interface DecodedData {
    //   name: string;
    //   email: string;
    // }

    // const decodedData: DecodedData = jwtDecode(e.credential);

    const newUser = {
      email: e.email,
      name: e.name,
      password: "Qwerty!123",
      isAutogenerated: true,
    };

    console.log(newUser);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register-user`,
        { userDetails: newUser }
      );

      //console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "exp",
        jwtDecode<JWTPayload>(localStorage.getItem("token")!).exp
      );
      navigate("/home");
      toast.success("Logged in with Google");
    } catch (error) {
      //console.log(error);
    }
  };

  const handleFaceBookLogin = async (e) => {
    const newUser = {
      email: e.data.email,
      name: e.data.name,
      password: "Qwerty!123",
      isAutogenerated: true,
    };

    //console.log(newUser);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/register-user`,
        { userDetails: newUser }
      );
      //console.log(response);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "exp",
        jwtDecode<JWTPayload>(localStorage.getItem("token")!).exp
      );
      navigate("/home");
      toast.success("Logged in with Facebook");
    } catch (error) {
      //console.log(error);
    }
  };

  const GLOGIN = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      setisLoading(true);
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => handleGoogleLogin(res.data));

      console.log(userInfo);
    },
    onError: (err) => {
      toast.error("Opps!!! Something went wrong");
      setisLoading(false);
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
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
        <h1>{isRestPassword ? "Reset Password" : "LOGIN..."}</h1>

        {/* {!isRestPassword && (
        <LoginSocialGoogle
          client_id={
            "184096121816-mfg6hcepv5dh7lbc8uo5gup09e45mjfk.apps.googleusercontent.com"
          }
          // onLoginStart={onLoginStart}
          onResolve={(data) => {
            handleGoogleLogin(data);
            // //console.log(data);
          }}
          onReject={(err) => {
            toast.error("Something went wrong");
          }}
        >
          <GoogleLoginButton className="btn">
            Continue With Google
          </GoogleLoginButton>
        </LoginSocialGoogle>
      )} */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // marginBottom: "1rem",
          }}
        >
          {!isRestPassword && (
            <div>
              <GoogleLoginButton onClick={() => GLOGIN()} className="btn">
                Continue With Google
              </GoogleLoginButton>
            </div>
          )}

          {!isRestPassword && (
            <LoginSocialFacebook
              appId="1086880865723734"
              onResolve={handleFaceBookLogin}
              onReject={(e) => {
                //console.log(e);
              }}
            >
              <FacebookLoginButton className="btn">
                Continue With Facebook
              </FacebookLoginButton>
            </LoginSocialFacebook>
          )}
        </div>
        <span>OR</span>

        {!otpReceived && (
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
        )}
        {otpReceived && !otpVerifed && (
          <div className="formInput">
            <input
              style={{ width: "100%" }}
              className={!isRestPassword ? "hide" : "input-field"}
              placeholder="OTP"
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
          </div>
        )}

        <div className="formInput" style={{ position: "relative" }}>
          <input
            style={{ width: "100%" }}
            className={isRestPassword && !otpVerifed ? "hide " : ""}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={userDetails.password}
            onChange={handleInput}
          />
          <button
            className={isRestPassword && !otpVerifed ? "hide" : ""}
            style={{
              position: "absolute",
              top: "25%",
              right: "12px",
              width: "50px",
              height: "50%",
              outline: "none",
              border: "none",
              cursor: "pointer",
              background: "white",
            }}
            onClick={() => {
              setshowPassword(!showPassword);
            }}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        </div>
        {/* </div> */}
        {!isLoading && (
          <button
            onClick={handleLogin}
            className={!otpVerifed ? "login-button" : "hide"}
          >
            {!otpReceived && isRestPassword
              ? "Get OTP"
              : otpReceived && isRestPassword
              ? "Verify OTP"
              : "LOGIN"}
          </button>
        )}
        {isLoading && (
          <button className={!otpVerifed ? "login-button" : "hide"}>
            <span className="loader"></span>
          </button>
        )}

        <button
          onClick={handleResetPassword}
          className={otpVerifed ? "login-button" : "hide"}
        >
          {!isLoading ? "Reset Password" : <span className="loader"></span>}
        </button>

        {!isVerifed && (
          <button className="login-button" onClick={getVerificationMail}>
            Click here to get an email to verify your account
          </button>
        )}

        <p className={isRestPassword ? "hide" : ""}>
          Forgot Password?{" "}
          <span
            style={{ borderBottom: "1px solid white", cursor: "pointer" }}
            onClick={resetPassword}
          >
            Reset
          </span>{" "}
        </p>

        <span>OR</span>

        <p className={!isRestPassword ? "hide" : ""}>
          Go back and{" "}
          <span
            style={{
              fontWeight: "500",
              borderBottom: "1px solid red",
              cursor: "pointer",
            }}
            onClick={() => {
              setisRestPassword(false);
            }}
          >
            Login
          </span>{" "}
        </p>

        <p className={isRestPassword ? "hide" : ""}>
          Don't have an account{" "}
          <span>
            <Link to="/signup">Signup</Link>
          </span>{" "}
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
