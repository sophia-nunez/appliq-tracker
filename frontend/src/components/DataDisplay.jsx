import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import ActivityChart from "./ActivityChart";
import CompaniesChart from "./CompaniesChart";
import Checkbox from "./Checkbox";
import { Periods } from "../data/enums";
import "@mantine/dates/styles.css";

const DataDisplay = () => {
  // for activity chart
  const [type, setType] = useState("Activity");
  const [dateRange, setDateRange] = useState(Periods.ALL);
  const [dateLabel, setDateLabel] = useState(new Date().getFullYear());
  const [customRange, setCustomRange] = useState([
    new Date().toISOString().substring(0, 10),
    new Date().toISOString().substring(0, 10),
  ]);

  // for top company chart
  const [orderBy, setOrderBy] = useState("applied");
  const [filter, setFilter] = useState(["applied", "interview", "offer"]);

  //TODO: add filter/sort functionality for top companies, and a custom date range selector for Activity chart

  // updates filter list for application types to show on company chart
  const handleFilter = (e) => {
    const value = e.target.value;
    if (filter.includes(value)) {
      // remove from array
      setFilter((prev) => prev.filter((item) => item !== value));
    } else {
      // add to array
      setFilter((prev) => [...prev, value]);
    }
  };

  return (
    <article className="chart-container">
      <select
        name="chart"
        id="chart"
        className="chart-dropdown chart-title"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="Activity">Application Activity</option>
        <option value="top-companies">Top Companies</option>
      </select>
      <>
        <div className="chart-content">
          <div className="chart">
            {type === "Activity" ? (
              <>
                <ActivityChart dateRange={dateRange} />
                {dateRange !== Periods.ALL && <h4>{dateLabel}</h4>}
              </>
            ) : (
              <CompaniesChart orderBy={orderBy} filter={filter} />
            )}
          </div>
          <div className="chart-details">
            {type === "Activity" ? (
              <>
                <p> Date Range: </p>
                <div className="chart-buttons">
                  <div className="preset-range">
                    <button
                      onClick={() => {
                        setDateRange(Periods.ALL);
                        setDateLabel("");
                      }}
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setDateRange(Periods.YEAR);
                        setDateLabel(new Date().getFullYear());
                      }}
                    >
                      1 Year
                    </button>
                    <button
                      onClick={() => {
                        setDateRange(Periods.MONTH);
                        setDateLabel(
                          new Date().toLocaleString("default", {
                            month: "long",
                          })
                        );
                      }}
                    >
                      1 Month
                    </button>
                  </div>
                  <div className="custom-range">
                    <DatePickerInput
                      type="range"
                      placeholder="Pick dates range"
                      value={customRange}
                      onChange={setCustomRange}
                    />
                    <button
                      onClick={() => {
                        setDateRange(customRange);
                        setDateLabel("Custom Range");
                      }}
                    >
                      Set
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <fieldset>
                  <legend> Sort by: </legend>
                  <div className="chart-buttons">
                    <div className="selection">
                      <input
                        type="radio"
                        id="applications"
                        name="orderBy"
                        value="applied"
                        onClick={(e) => setOrderBy(e.target.value)}
                        defaultChecked
                      />
                      <label htmlFor="applications">Applications</label>
                    </div>
                    <div className="selection">
                      <input
                        type="radio"
                        id="interviews"
                        name="orderBy"
                        value="interview"
                        onClick={(e) => setOrderBy(e.target.value)}
                      />
                      <label htmlFor="interviews">Interviews</label>
                    </div>
                    <div className="selection">
                      <input
                        type="radio"
                        id="offers"
                        name="orderBy"
                        value="offer"
                        onClick={(e) => setOrderBy(e.target.value)}
                      />
                      <label htmlFor="offers">Offers</label>
                    </div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Filter by application status:</legend>

                  <Checkbox
                    label="Applied"
                    valueName="applied"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Interview"
                    valueName="interview"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Offer"
                    valueName="offer"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Rejected"
                    valueName="rejected"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Signed"
                    valueName="signed"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Other"
                    valueName="other"
                    handleFilter={handleFilter}
                  />
                </fieldset>
              </>
            )}
          </div>
        </div>
      </>
    </article>
  );
};

export default DataDisplay;
