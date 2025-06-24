import { Link } from "react-router";
import { homePath, applicationsPath, companiesPath, dataPath } from "../links";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-links">
        <h5>Our Pages:</h5>
        <section className="nav-links">
          <Link to={homePath}>Home</Link>
          <Link to={applicationsPath}>Applications</Link>
          <Link to={companiesPath}>Companies</Link>
          <Link to={dataPath}>Data</Link>
        </section>
      </div>
      <p>Appliq Tracker @2025</p>
    </footer>
  );
};

export default Footer;
