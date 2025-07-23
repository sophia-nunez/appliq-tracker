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
import { useOutletContext } from "react-router";

const CompaniesChart = ({ orderBy, filter }) => {
  const { setMessage, setStatusOpen } = useOutletContext();
  const [data, setData] = useState(Array());

  useEffect(() => {
    loadCompanies();
  }, [orderBy, filter]);

  // gets companies is given order
  const loadCompanies = async () => {
    try {
      // get application count groups by company and status
      const loadedData = await getCompanyData(orderBy, filter);

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
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data." });
    }
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
        interval={0}
        // tickeFormatter code from https://stackoverflow.com/questions/67950014
        tickFormatter={(value, index) => {
          const limit = 9;
          if (value.length < limit) return value;
          return `${value.substring(0, limit)}...`;
        }}
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
