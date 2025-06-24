import { Link } from "react-router";
import SearchBar from "../components/SearchBar";
import Featured from "../components/Featured";
import List from "../components/List";
import "../styles/HomePage.css";

const HomePage = () => {
  return (
    <main>
      <h2>Home</h2>
      <nav className="home-nav">
        <Link to="/applications">Applications</Link>
        <Link to="/companies">Companies</Link>
        <Link to="/data">Data</Link>
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
