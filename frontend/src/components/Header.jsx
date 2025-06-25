import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { IoMenu } from "react-icons/io5";
import { useUser } from "./UserContext";
import { useTheme } from "../components/ThemeContext";
import icon from "../assets/images/icon.png";
import darkIcon from "../assets/images/icon-dark.png";
import NavBar from "./NavBar.jsx";
import { homePath } from "../links.js";
import "../styles/Header.css";

const Header = () => {
  const { theme } = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);
  const { user } = useUser();

  // closes modal on window click off of modal or on span
  useEffect(() => {
    function handleWindowClick(event) {
      const span = document.getElementsByClassName("close")[0];
      if (event.target === span) {
        navRef.current.classList.add("modalClosed"); // causes slideout animation
        const timeout = setTimeout(() => {
          setNavOpen(false);
          clearTimeout(timeout);
        }, "800");
      }
      if (navRef.current && event.target === navRef.current) {
        setNavOpen(false);
        // TODO: cause slideout animation here as well? or only clicking close
      }
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const openNav = () => {
    setNavOpen(true);
  };

  return (
    <>
      <header>
        <Link to={homePath}>
          <img
            src={theme === "light" ? icon : darkIcon}
            alt="Appliq logo"
            className="logo"
          />
          <h1>Appliq</h1>
        </Link>
        {user && <IoMenu className="nav-icon" onClick={openNav} />}
      </header>
      {navOpen && <NavBar reference={navRef} />}
    </>
  );
};

export default Header;
