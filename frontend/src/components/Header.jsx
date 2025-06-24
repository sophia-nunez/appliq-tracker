import { useRef, useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import icon from "../assets/images/icon.png";
import NavBar from "./NavBar.jsx";
import "../styles/Header.css";

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navRef = useRef(null);

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
        <img src={icon} alt="Appliq logo" className="logo" />
        <h1>Appliq</h1>
        <IoMenu className="nav-icon" onClick={openNav} />
      </header>
      {navOpen && <NavBar navOpen={navOpen} reference={navRef} />}
    </>
  );
};

export default Header;
