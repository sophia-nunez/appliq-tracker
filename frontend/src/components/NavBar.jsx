import { Link } from "react-router";
import { IoMdClose } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import "../styles/NavBar.css";
import {
  homePath,
  applicationsPath,
  companiesPath,
  dataPath,
  settingsPath,
} from "../links";

const NavBar = ({ navOpen, reference }) => {
  return (
    <aside id="nav-modal" className="modal" ref={reference}>
      <section id="modal-content">
        <div className="top-row">
          <h2>Appliq</h2>
          <span className="close">
            <IoMdClose className="close-icon" />
          </span>
        </div>
        <nav>
          <Link to={homePath}>Home</Link>
          <Link to={applicationsPath}>Applications</Link>
          <Link to={companiesPath}>Companies</Link>
          <Link to={dataPath}>Data</Link>
          <div id="non-nav-btns">
            <button className="logout-btn">Log Out</button>
            <Link to={settingsPath}>
              <IoSettingsOutline className="settings-icon" />
            </Link>
          </div>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
