import { Link } from "react-router";
import Featured from "../components/Featured";
import List from "../components/List";
import { applicationsPath, companiesPath, dataPath } from "../links";
import "../styles/HomePage.css";
import { useEffect } from "react";
import { findInterviewTimes, setInterviewTime } from "../utils/oauthUtils";

const HomePage = () => {
  useEffect(() => {
    try {
      const interviews = findInterviewTimes();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <main>
      <h2>Home</h2>
      <nav className="home-nav">
        <Link to={applicationsPath}>Applications</Link>
        <Link to={companiesPath}>Companies</Link>
        <Link to={dataPath}>Data</Link>
      </nav>
      <section className="featured-container">
        <Featured />
      </section>
      <section className="featured-container">
        <h3>Notes</h3>
        <List />
      </section>
    </main>
  );
};

export default HomePage;
