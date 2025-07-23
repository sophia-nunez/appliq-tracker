import { DatePickerInput } from "@mantine/dates";
import { useState } from "react";
import ActivityChart from "./ActivityChart";
import CompaniesChart from "./CompaniesChart";
import Checkbox from "./Checkbox";
import { Periods } from "../data/enums";
import "@mantine/dates/styles.css";
import { Card, Divider, InputLabel, Select } from "@mantine/core";

const DataDisplay = () => {
  // for activity chart
  const [type, setType] = useState("Activity");
  const [dateRange, setDateRange] = useState(Periods.ALL);
  const [dateLabel, setDateLabel] = useState(new Date().getFullYear());
  const [customRangeOpen, setCustomOpen] = useState(false);
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

  const setRange = (val) => {
    setDateRange(val);
    if (val !== Periods.CUSTOM) {
      setCustomOpen(false);
    }

    switch (val) {
      case Periods.ALL:
        setDateLabel("");
        break;
      case Periods.YEAR:
        setDateLabel(new Date().getFullYear());
        break;
      case Periods.MONTH:
        setDateLabel(
          new Date().toLocaleString("default", {
            month: "long",
          })
        );
        break;
      case Periods.CUSTOM:
        setDateLabel("Custom Range");
        setCustomOpen(true);
        break;
      default:
        setDateLabel("Invalid range - please try again.");
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
                <div className="chart-buttons">
                  <Select
                    id="range-selector"
                    label="Date Range"
                    data={[
                      Periods.ALL,
                      Periods.YEAR,
                      Periods.MONTH,
                      Periods.CUSTOM,
                    ]}
                    defaultValue="Periods.ALL"
                    allowDeselect={false}
                    value={dateRange}
                    onChange={(val) => setRange(val)}
                  />

                  {customRangeOpen && (
                    <>
                      <Card className="custom-range">
                        <InputLabel>Select a range:</InputLabel>
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
                      </Card>
                    </>
                  )}

                  <Divider />
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
