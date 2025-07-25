import { useEffect, useState } from "react";
import { Order } from "../data/enums";
import "../styles/SearchBar.css";

const SearchBar = ({
  pageName,
  query,
  setQuery,
  orderBy,
  setOrderBy,
  handleSearch,
}) => {
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    handleSearch();
  }, [searchCount]);

  // checks if key pressed is enter, and if so submits search
  const enterSearch = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      setSearchCount(searchCount + 1);
    }
  };

  // resets search bar
  const clearSearch = () => {
    setQuery("");
    setSearchCount(searchCount + 1);
  };

  return (
    <section className="searchbar-content">
      <h2>{pageName}</h2>
      <search className="search-sort">
        <div className="search-container">
          <input
            type="text"
            name="search"
            id="search"
            className="search"
            placeholder={`Search ${pageName}...`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyUp={enterSearch}
          />
          <span className="clear-search-btn" onClick={clearSearch}>
            x
          </span>
        </div>
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
              <option value={Order.RECENT}>Most Recent</option>
              {pageName === "Applications" && (
                <option value={Order.INTERVIEW}>Interview Date</option>
              )}
              {(pageName === "Companies" || query === "") && (
                <option value={Order.ALPHABETICAL}>Name (A-Z)</option>
              )}
            </select>
          </div>
        )}
      </search>
    </section>
  );
};

export default SearchBar;
