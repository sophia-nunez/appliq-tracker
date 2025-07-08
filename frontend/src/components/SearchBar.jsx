import "../styles/SearchBar.css";

const SearchBar = ({ pageName, query, setQuery, orderBy, setOrderBy }) => {
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
        <select
          name="sort-by"
          id="sort-by"
          value={orderBy}
          onChange={(e) => {
            setOrderBy(e.target.value);
          }}
        >
          <option value="all" disabled>
            Sort By
          </option>
          <option value="alphabetical">Name (A-Z)</option>
          <option value="recent">Most Recent</option>
          {pageName === "Applications" && (
            <option value="interviewDate">Interview Date</option>
          )}
        </select>
      </search>
    </section>
  );
};

export default SearchBar;
