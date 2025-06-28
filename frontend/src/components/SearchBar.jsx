import "../styles/SearchBar.css";

const SearchBar = ({ pageName, query, setQuery, handleSearch }) => {
  return (
    <section className="searchbar-content">
      <h2>{pageName}</h2>
      <search className="search-sort">
        <input
          type="search"
          className="search"
          placeholder="Search Applications..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <select name="sort-by" id="sort-by" value="default">
          <option value="default" disabled>
            Sort By
          </option>
          <option value="dateApplied">Date Applied</option>
        </select>
      </search>
    </section>
  );
};

export default SearchBar;
