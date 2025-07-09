import { useState } from "react";
import ActivityChart from "./ActivityChart";

const DataDisplay = () => {
  const [type, setType] = useState("Activity");
  const [dateRange, setDateRange] = useState("all");

  return (
    <article className="chart-container">
      <div className="chart">
        {type === "Activity" && <ActivityChart dateRange={dateRange} />}
      </div>
      <div className="chart-description">
        <select
          name="chart"
          id="chart"
          className="chart-dropdown chart-title"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Activity">All Activity</option>
          <option value="top-companies">Top Companies</option>
        </select>
        <div className="chart-details">
          <p> Chart Details </p>
          {type === "Activity" && (
            <>
              <button>1 Month</button>
              <button>1 Year</button>
              <button>All</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default DataDisplay;
