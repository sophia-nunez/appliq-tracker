import { useState } from "react";
import ActivityChart from "./ActivityChart";

const DataDisplay = () => {
  const [type, setType] = useState("Activity");

  return (
    <article className="chart-container">
      <div className="chart">{type === "Activity" && <ActivityChart />}</div>
      <div className="chart-description">
        <select
          name="chart"
          id="chart"
          className="chart-dropdown chart-title"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Activity">All Activity</option>
          <option value="Recent">Recent Activity</option>
          <option value="top-companies">Top Companies</option>
        </select>
        <p>Chart details</p>
      </div>
    </article>
  );
};

export default DataDisplay;
