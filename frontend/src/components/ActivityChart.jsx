import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getApplicationGroupData } from "../utils/dataUtils";
import { Periods } from "../data/enums";

const ActivityChart = ({ dateRange }) => {
  const [data, setData] = useState(Array());

  useEffect(() => {
    if (dateRange === Periods.CUSTOM) {
      setData([]);
    } else {
      loadActivity();
    }
  }, [dateRange]);

  const loadActivity = async () => {
    const loadedData = await getApplicationGroupData(dateRange);

    let options = { month: "short", day: "numeric", year: "numeric" };
    if (dateRange === Periods.YEAR) {
      options = { month: "short", day: "numeric" };
    } else if (dateRange === Periods.MONTH) {
      options = { day: "numeric" };
    }

    let formattedData = loadedData.map((date) => {
      const fullDate = new Date(date.day);
      // format date to "Month dd, yyyy"
      const formattedDate = fullDate.toLocaleDateString(undefined, options);

      return { name: formattedDate, applications: date.count };
    });

    // add first day of range so it always shows
    if (dateRange === Periods.MONTH || dateRange === Periods.YEAR) {
      // get first day of range
      const now = new Date();
      let firstDate;
      if (dateRange === Periods.YEAR) {
        // create date for first day of year
        firstDate = new Date(now.getFullYear(), 0, 1);
      } else if (dateRange === Periods.MONTH) {
        // create date for first day of month
        firstDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      const formattedFirstDate = firstDate.toLocaleDateString(
        undefined,
        options
      );

      // add to array if not already there
      if (!formattedData.some((data) => data.name === formattedFirstDate)) {
        formattedData.unshift({ name: formattedFirstDate, applications: 0 });
      }
    }

    setData(formattedData);
  };

  return (
    <>
      {data && data.length > 0 ? (
        <ResponsiveContainer height={350} width="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="var(--text-color)"
              tick={{ fill: "var(--text-color)" }}
            />
            <YAxis
              stroke="var(--text-color)"
              tick={{ fill: "var(--text-color)" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ height: "350px", placeContent: "center" }}>
          No data to display. Please set a range below!
        </p>
      )}
    </>
  );
};

export default ActivityChart;
