import { PieChart, Pie, Cell } from "recharts";
import { Status } from "../data/enums";

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
      fill="var(--text-color)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {` ${name} (${value}) `}
    </text>
  );
};

//
const SummaryChart = ({ data }) => {
  const colors = new Map([
    [Status.Interview, "#F5A623"],
    [Status.Offer, "#82ca9d"],
    [Status.Rejected, "#D0021B"],
    [Status.Signed, "#560bad"],
    [Status.Applied, "#4A90E2"],
    [Status.Other, "#9B9B9B"],
  ]);

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
