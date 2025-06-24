import SearchBar from "./SearchBar";

const HomePage = () => {
  return (
    <main>
      <SearchBar />
      <section className="featured-container">
        <p>Featured applications</p>
      </section>
      <section className="notes-container">
        <p>Notes</p>
      </section>
    </main>
  );
};

export default HomePage;
