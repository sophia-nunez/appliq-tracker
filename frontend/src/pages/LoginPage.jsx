import { useState } from "react";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const updateUser = (event) => {
    setUsernameInput(event.target.value);
  };

  const updatePass = (event) => {
    setPasswordInput(event.target.value);
  };

  return (
    <main>
      <section className="login-container">
        <h2>Login</h2>
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
            type="text"
            name="password"
            id="password"
            value={passwordInput}
            onChange={updatePass}
          />
        </div>
        <div className="login-btns">
          <button className="login-btn">Log in</button>
          <hr />
          <p>Or</p>
          <button className="register-btn">Register</button>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
