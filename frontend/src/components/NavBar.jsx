import { Link, useNavigate } from "react-router";
import { googleLogout } from "@react-oauth/google";
import { useUser } from "./UserContext";
import { IoMdClose, IoIosLogOut, IoIosSettings } from "react-icons/io";
import { Divider } from "@mantine/core";
import { baseURL } from "../utils/authUtils";
import "../styles/NavBar.css";
import {
  homePath,
  applicationsPath,
  companiesPath,
  dataPath,
  settingsPath,
  loginPath,
} from "../data/links";

const NavBar = ({ closeNav, reference }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // ends session, resets user, and returns to the login page
  const handleLogout = async () => {
    googleLogout();
    await fetch(`${baseURL()}/logout`, {
      method: "POST",
      credentials: "include",
    });
    closeNav(); // close navbar
    setUser({});
    navigate(loginPath);
  };

  return (
    <aside id="nav-modal" className="modal" ref={reference}>
      <section id="nav-content">
        <div className="top-row">
          <h2>Appliq</h2>
          <span id="nav-close" className="close">
            <IoMdClose className="close-icon" />
          </span>
        </div>
        <span>
          Signed in as <strong>{user.username}</strong>
        </span>
        <Divider size="sm" className="divider" />
        <nav>
          <Link to={homePath} onClick={closeNav}>
            Home
          </Link>
          <Link to={applicationsPath} onClick={closeNav}>
            Applications
          </Link>
          <Link to={companiesPath} onClick={closeNav}>
            Companies
          </Link>
          <Link to={dataPath} onClick={closeNav}>
            Data
          </Link>
          <div className="bottom-nav">
            <Divider size="sm" />
            <div id="non-nav-btns">
              <Link to={settingsPath} onClick={closeNav}>
                <IoIosSettings className="settings-icon" />
                Settings
              </Link>
              <div className="logout-btn" onClick={handleLogout}>
                <IoIosLogOut className="settings-icon" />
                Log Out
              </div>
            </div>
          </div>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
