import { PieChart, Pie, Cell } from "recharts";

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
const SummaryChart = ({ data }) => {
  const colors = new Map([
    ["Interview", "#F5A623"],
    ["Offer", "#7ED321"],
    ["Rejected", "#D0021B"],
    ["Signed", "#560bad"],
    ["Applied", "#4A90E2"],
    ["Other", "#9B9B9B"],
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
