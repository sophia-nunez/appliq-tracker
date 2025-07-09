import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getApplicationGroupData } from "../utils/applicationUtils";

const ActivityChart = ({ dateRange }) => {
  const [data, setData] = useState(Array());

  useEffect(() => {
    loadActivity();
  }, []);

  const loadActivity = async () => {
    const loadedData = await getApplicationGroupData("year-range");
    const formattedData = loadedData.map((date) => {
      const fullDate = new Date(date.day);
      // format date to "Month dd, yyyy"
      const options = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = fullDate.toLocaleDateString(undefined, options);

      return { name: formattedDate, applications: date.count };
    });
    setData(formattedData);
  };

  return (
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
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="applications"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default ActivityChart;
