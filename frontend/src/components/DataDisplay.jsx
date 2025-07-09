import { useState } from "react";
import ActivityChart from "./ActivityChart";

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
          </div>
          <div className="chart-details">
            {type === "Activity" && (
              <>
                <p> Date Range: </p>
                <button onClick={() => setDateRange("month-range")}>
                  1 Month
                </button>
                <button onClick={() => setDateRange("year-range")}>
                  1 Year
                </button>
                <button onClick={() => setDateRange("all-range")}>All</button>
              </>
            )}
          </div>
        </div>
      </>
    </article>
  );
};

export default DataDisplay;
