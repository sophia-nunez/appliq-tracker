import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../utils/authUtils";
import "../styles/LoginPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateUser = (event) => {
    setError("");
    setSuccess("");
    setUsernameInput(event.target.value);
  };

  const updatePass = (event) => {
    setError("");
    setSuccess("");
    setPasswordInput(event.target.value);
  };

  const handleRegister = async () => {
    const user = { username: usernameInput, password: passwordInput };
    try {
      await registerUser(user);
      setSuccess("Registration successful! Redirecting...");
      const timeout = setTimeout(() => {
        navigate("/login", {
          state: { message: "Account created successfully!" },
        });
        clearTimeout(timeout);
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInputs();
    }
  };

  const clearInputs = () => {
    setUsernameInput("");
    setPasswordInput("");
  };

  return (
    <main>
      <section className="register-container">
        <h2>Register</h2>
        <div className="username-input input-container">
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            name="username"
            id="username"
            value={usernameInput}
            onChange={updateUser}
          />
        </div>
        <div className="password-input input-container">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            value={passwordInput}
            onChange={updatePass}
          />
        </div>
        <div className="register-btns">
          <button className="register-btn" onClick={handleRegister}>
            Register
          </button>
        </div>
        {success && <p className="success-text">{success}</p>}
        {error && <p className="error-text">{error}</p>}
      </section>
    </main>
  );
};

export default RegisterPage;
