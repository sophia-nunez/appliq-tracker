import { ThemeProvider, useTheme } from "./ThemeContext";
import { IoMdClose } from "react-icons/io";
import "../styles/NavBar.css";

const NavBar = ({ navOpen, reference }) => {
  const { theme, toggleTheme } = useTheme();

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
          <button>Home</button>
          <button>Applications</button>
          <button>Companies</button>
          <button>Data</button>
          <button id="toggle-mode" onClick={toggleTheme}>
            {theme === "light" ? "☀️ Light" : "🌖 Dark"}
          </button>
        </nav>
      </section>
    </aside>
  );
};

export default NavBar;
