import { useEffect, useState } from "react";
import { getCompanyData } from "../utils/dataUtils";
import { Status } from "../data/enums";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CompaniesChart = ({ orderBy, filter }) => {
  // TODO: filter data by application status
  const [data, setData] = useState(Array());

  useEffect(() => {
    loadCompanies();
  }, [orderBy]);

  // add second useEffect for filterCompanies when filter changes

  // gets companies is given order
  const loadCompanies = async () => {
    // get application count groups by company and status
    const loadedData = await getCompanyData(orderBy);

    // group all status types for company results
    const groupedCompanies = Object.groupBy(
      loadedData,
      (company) => company.companyName
    );

    // format into name with fields for each application status
    const formattedData = Object.keys(groupedCompanies).map((key) => {
      // set name to companyName
      let company = { name: key };

      // for each application status the company contains, set this field with the count
      groupedCompanies[key].forEach((status) => {
        company[status.status] = status._count._all;
      });

      // name: companyName, [status]: int
      return company;
    });

    setData(formattedData);
  };

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
      <XAxis
        dataKey="name"
        stroke="var(--text-color)"
        tick={{ fill: "var(--text-color)" }}
      />
      <YAxis stroke="var(--text-color)" tick={{ fill: "var(--text-color)" }} />
      <Tooltip />
      <Legend />
      <Bar dataKey={Status.Applied} stackId="a" fill="#4A90E2" />
      <Bar dataKey={Status.Interview} stackId="a" fill="#F5A623" />
      <Bar dataKey={Status.Offer} stackId="a" fill="#82ca9d" />
      <Bar dataKey={Status.Rejected} stackId="a" fill="#D0021B" />
      <Bar dataKey={Status.Signed} stackId="a" fill="#560bad" />
      <Bar dataKey={Status.Other} stackId="a" fill="#9B9B9B" />
    </BarChart>
  );
};

export default CompaniesChart;
