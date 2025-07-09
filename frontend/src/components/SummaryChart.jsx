import { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { getApplicationSummary } from "../utils/applicationUtils";
const data = [{ name: "Page A", uv: 400, pv: 2400, amt: 2400 }];

// label to go on outside, middle section, with status and count
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  value,
  name,
}) => {
  const radian = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * radian);
  const y = cy + radius * Math.sin(-midAngle * radian);

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {` ${name} (${value}) `}
    </text>
  );
};

//
const SummaryChart = () => {
  const [data, setData] = useState(Array());
  const colors = new Map([
    ["Interview", "#F5A623"], // interview
    ["Offer", "#7ED321"], // offer
    ["Rejected", "#D0021B"], // rejected
    ["Signed", "#560bad"], //signed
    ["Applied", "#4A90E2"], // applied
    ["Other", "#9B9B9B"],
  ]);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const loadedData = await getApplicationSummary();
    const formattedData = loadedData.map((type) => {
      return { name: type.status, value: type._count._all };
    });
    setData(formattedData);
  };

  return (
    <PieChart width={730} height={250}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#82ca9d"
        label={renderCustomizedLabel}
      >
        {
          // sets attributes (fill) for each section of the graph
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors.get(entry.name)} />
          ))
        }
      </Pie>
    </PieChart>
  );
};

export default SummaryChart;
