import { Link, useNavigate } from "react-router";
import { useUser } from "./UserContext";
import { IoMdClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { baseURL } from "../utils/authUtils";
import "../styles/NavBar.css";
import {
  homePath,
  applicationsPath,
  companiesPath,
  dataPath,
  settingsPath,
  loginPath,
} from "../links";

const NavBar = ({ closeNav, reference }) => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
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
        <nav>
          <Link to={homePath}>Home</Link>
          <Link to={applicationsPath}>Applications</Link>
          <Link to={companiesPath}>Companies</Link>
          <Link to={dataPath}>Data</Link>
          <div className="bottom-nav">
            <span>
              Signed in as <strong>{user.username}</strong>
            </span>
            <div id="non-nav-btns">
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
              <Link to={settingsPath}>
                <IoSettingsOutline className="settings-icon" />
              </Link>
            </div>
          </div>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
