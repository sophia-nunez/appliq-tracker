import { useEffect, useState } from "react";
import { getApplicationGroupData } from "../utils/dataUtils";
import SummaryChart from "./SummaryChart";

const SummarySection = () => {
  const [data, setData] = useState(Array());

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const loadedData = await getApplicationGroupData("status");
    const formattedData = loadedData.map((type) => {
      return { name: type.status, value: type._count._all };
    });
    setData(formattedData);
  };

  return (
    <article className="summary-chart">
      <h4 className="chart-title">Summary</h4>
      <SummaryChart data={data} />
    </article>
  );
};
export default SummarySection;
