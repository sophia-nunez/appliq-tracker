import SearchBar from "./SearchBar";
import Featured from "./Featured";
import List from "./List";

const HomePage = () => {
  return (
    <main>
      <SearchBar />
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
