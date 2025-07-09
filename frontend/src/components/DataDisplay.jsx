import { useState } from "react";
import ActivityChart from "./ActivityChart";
import CompaniesChart from "./CompaniesChart";

const DataDisplay = () => {
  const [type, setType] = useState("Activity");
  const [dateRange, setDateRange] = useState("all-range");

  return (
    <article className="chart-container">
      <select
        name="chart"
        id="chart"
        className="chart-dropdown chart-title"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Activity">Applications Made</option>
        <option value="top-companies">Top Companies</option>
      </select>
      <>
        <div className="chart-content">
          <div className="chart">
            {type === "Activity" && (
              <>
                <ActivityChart dateRange={dateRange} />
                {dateRange !== "all-range" && (
                  <h4>{new Date().getFullYear()}</h4>
                )}
              </>
            )}

            {
              /* TODO: add top companies chart (up to 6 companies with the most ___ - filterable by all, interview, or offer) */
              type === "top-companies" && <CompaniesChart />
            }
          </div>
          <div className="chart-details">
            {type === "Activity" && (
              <>
                <p> Date Range: </p>
                <div className="chart-buttons">
                  <button onClick={() => setDateRange("all-range")}>All</button>
                  <button onClick={() => setDateRange("year-range")}>
                    1 Year
                  </button>
                  <button onClick={() => setDateRange("month-range")}>
                    1 Month
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    </article>
  );
};

export default DataDisplay;
