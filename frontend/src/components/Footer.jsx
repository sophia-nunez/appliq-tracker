import { Link } from "react-router";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-links">
        <h5>Our Pages:</h5>
        <section className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/data">Data</Link>
        </section>
      </div>
      <p>Appliq Tracker @2025</p>
    </footer>
  );
};

export default Footer;
