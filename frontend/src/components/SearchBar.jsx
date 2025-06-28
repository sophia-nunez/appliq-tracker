import "../styles/SearchBar.css";

const SearchBar = ({ pageName }) => {
  return (
    <section className="searchbar-content">
      <h2>{pageName}</h2>
      <div className="search-sort">
        <input
          type="search"
          className="search"
          placeholder="Search Applications..."
        />
        <select name="sort-by" id="sort-by" value="default">
          <option value="default" disabled>
            Sort By
          </option>
          <option value="dateApplied">Date Applied</option>
        </select>
      </div>
    </section>
  );
};

export default SearchBar;
