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
        setNavOpen(false);
      }
      if (modalRef.current && event.target === modalRef.current) {
        setNavOpen(false);
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
      {navOpen && <NavBar reference={navRef} />}
    </>
  );
};

export default Header;
