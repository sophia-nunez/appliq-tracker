import "../styles/SearchBar.css";

const SearchBar = ({ pageName, query, setQuery, orderBy, setOrderBy }) => {
  return (
    <section className="searchbar-content">
      <h2>{pageName}</h2>
      <search className="search-sort">
        <input
          type="search"
          className="search"
          placeholder={`Search ${pageName}...`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        {(pageName !== "Applications" || !query) && (
          <div>
            <label htmlFor="sort-by">Sort By: </label>
            <select
              name="sort-by"
              id="sort-by"
              value={orderBy}
              onChange={(e) => {
                setOrderBy(e.target.value);
              }}
            >
              <option value="recent">Most Recent</option>
              {pageName === "Applications" && (
                <option value="interviewDate">Interview Date</option>
              )}
              {(pageName === "Companies" || query === "") && (
                <option value="alphabetical">Name (A-Z)</option>
              )}
            </select>
          </div>
        )}
      </search>
    </section>
  );
};

export default SearchBar;
