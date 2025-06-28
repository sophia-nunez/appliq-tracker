import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useUser } from "./UserContext";
import { loginUser, registerUser } from "../utils/authUtils";
import { homePath, registerPath } from "../links";
import "../styles/LoginPage.css";

const AuthForm = ({ type }) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  }

  const clearInputs = () => {
    setFormInput({ username: "", password: "" });
  };

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
        text: err.message || "Network issue. Please try again.",
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
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formInput.username}
            onChange={handleChange}
          />
        </div>
        <div className="password-input input-container">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formInput.password}
            onChange={handleChange}
          />
        </div>
        <div className={`${type}-btns`}>
          <button className={`${type}-btn`} onClick={handleSubmit}>
            {type === "register" ? "Register" : "Login"}
          </button>
          {type === "login" && (
            <>
              <hr />
              <p>Or</p>
              <button className="register-btn">
                <Link to={registerPath} className="register-btn">
                  Register
                </Link>
              </button>
            </>
          )}
        </div>
        {message && <p className={`${message.type}-text`}>{message.text}</p>}
      </section>
    </main>
  );
};

export default AuthForm;
