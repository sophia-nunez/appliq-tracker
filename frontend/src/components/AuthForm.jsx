import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "./UserContext";
import {
  loginGoogleUser,
  getGoogleToken,
  loginUser,
  registerUser,
} from "../utils/authUtils";
import { TextInput, PasswordInput } from "@mantine/core";
import { homePath, loginPath, registerPath } from "../data/links";
import "../styles/LoginPage.css";

const AuthForm = ({ type }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({}); // error or success message

  // google login for authorization
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => await handleGoogleLogin(tokenResponse),
    onError: () => {
      alert("Login failed. Please try again");
    },
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.app.created https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    include_granted_scopes: "true",
  });

  const handleGoogleLogin = async (tokenResponse) => {
    const hasAccess = hasGrantedAllScopesGoogle(
      tokenResponse,
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/calendar.app.created"
    );

    if (hasAccess) {
      try {
        const tokens = await getGoogleToken(tokenResponse);
        const userProfile = await loginGoogleUser(tokens);

        setUser(userProfile);
        setMessage({
          type: "success",
          text: "Successful! Redirecting...",
        });
        const timeout = setTimeout(() => {
          navigate(homePath);
          clearTimeout(timeout);
        }, 1000);
      } catch (err) {
        setMessage({
          type: "error",
          text: err.message || "Google login failed.",
        });
      }
    } else {
      alert("Login failed due to missing permissions.");
    }
  };

  // updates corresponding input field
  function handleChange(event) {
    const { name, value } = event.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  }

  // resets login inputs
  const clearInputs = () => {
    setFormInput({ username: "", password: "" });
  };

  // tries to log in or register user, then gives a message and redirects on success
  // if an issue is encountered, displays an error message
  const handleSubmit = async (event) => {
    event.preventDefault();
    let data;
    try {
      if (type === "login") {
        data = await loginUser(formInput);
      } else {
        data = await registerUser(formInput);
      }
      setUser(data);
      setMessage({
        type: "success",
        text: "Successful! Redirecting...",
      });
      const timeout = setTimeout(() => {
        navigate(homePath);
        clearTimeout(timeout);
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.message ||
          "There was an issue completing your request. Please try again.",
      });
    } finally {
      clearInputs();
    }
  };

  return (
    <main>
      <section className={`${type}-container`}>
        <h2>{type === "register" ? "Register" : "Login"}</h2>
        <div className="username-input input-container">
          <TextInput
            label="Username:"
            type="text"
            name="username"
            id="username"
            value={formInput.username}
            onChange={handleChange}
          />
        </div>
        <div className="password-input input-container">
          <PasswordInput
            label="Password:"
            type="password"
            name="password"
            id="password"
            value={formInput.password}
            onChange={handleChange}
          />
        </div>
        <div className={`${type}-btns`}>
          <button className={`${type}-btn`} onClick={handleSubmit}>
            {type === "login" ? "Login" : "Register"}
          </button>
          <section className="alt-login">
            <hr />
            <p>Or</p>
            <button className="google-btn" onClick={() => login()}>
              <FcGoogle className="google-logo" /> Sign in with Google
            </button>
            {type === "login" ? (
              <button className="register-btn">
                <Link to={registerPath} className="register-btn">
                  Register
                </Link>
              </button>
            ) : (
              <button className="login-btn">
                <Link to={loginPath} className="login-btn">
                  Login
                </Link>
              </button>
            )}
          </section>
        </div>
        {message && <p className={`${message.type}-text`}>{message.text}</p>}
      </section>
    </main>
  );
};

export default AuthForm;
