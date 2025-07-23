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
  const [orderBy, setOrderBy] = useState("Applied");
  const [filter, setFilter] = useState(["Applied", "Interview", "Offer"]);

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
                  <div className="selection">
                    <input
                      type="radio"
                      id="applications"
                      name="orderBy"
                      value="Applied"
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
                      value="Interview"
                      onClick={(e) => setOrderBy(e.target.value)}
                    />
                    <label htmlFor="interviews">Interviews</label>
                  </div>
                  <div className="selection">
                    <input
                      type="radio"
                      id="offers"
                      name="orderBy"
                      value="Offer"
                      onClick={(e) => setOrderBy(e.target.value)}
                    />
                    <label htmlFor="offers">Offers</label>
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Include:</legend>

                  <Checkbox
                    label="Applied"
                    valueName="Applied"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Interview"
                    valueName="Interview"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Offer"
                    valueName="Offer"
                    initial="true"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Rejected"
                    valueName="Rejected"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Signed"
                    valueName="Signed"
                    handleFilter={handleFilter}
                  />
                  <Checkbox
                    label="Other"
                    valueName="Other"
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
