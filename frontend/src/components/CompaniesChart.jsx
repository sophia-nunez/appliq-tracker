import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Page A",
    applications: 4,
    interviews: 2,
    offers: 0,
  },
  {
    name: "Page B",
    applications: 3,
    interviews: 1,
    offers: 1,
  },
  {
    name: "Page C",
    applications: 2,
    interviews: 3,
    offers: 2,
  },
  {
    name: "Page D",
    applications: 3,
    interviews: 1,
    offers: 0,
  },
  {
    name: "Page E",
    applications: 1,
    interviews: 0,
    offers: 0,
  },
];

const CompaniesChart = () => {
  // TODO: get company data dynamically

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 20,
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
      <Bar dataKey="applications" stackId="a" fill="#4A90E2" />
      <Bar dataKey="interviews" stackId="a" fill="#F5A623" />
      <Bar dataKey="offers" stackId="a" fill="#82ca9d" />
    </BarChart>
  );
};

export default CompaniesChart;
