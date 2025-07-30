import { useEffect, useState } from "react";
import { getApplicationGroupData } from "../utils/dataUtils";
import SummaryChart from "./SummaryChart";
import { Status } from "../data/enums";

const SummarySection = () => {
  const [data, setData] = useState(Array());
  const [sum, setSum] = useState(0);
  const [interviewRate, setInterviewRate] = useState(0);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const loadedData = await getApplicationGroupData("status");
    let currSum = 0;
    let interviewSum = 0;
    const formattedData = loadedData.map((type) => {
      currSum += type._count._all;
      if (
        type.status === Status.Interview ||
        type.status === Status.Offer ||
        type.status === Status.Signed
      ) {
        interviewSum += type._count._all;
      }
      return { name: type.status, value: type._count._all };
    });
    setData(formattedData);
    setSum(currSum);
    const unformattedRate = interviewSum / currSum;
    setInterviewRate(unformattedRate.toFixed(2));
  };

  return (
    <article className="summary-chart-container">
      <div className="summary-chart">
        <SummaryChart data={data} />
      </div>
      <div className="chart-details">
        <h3> Summary Chart</h3>
        <ul>
          <li>Total applications: {sum}</li>
          <li>Interview rate: {interviewRate}%</li>
        </ul>
      </div>
    </article>
  );
};
export default SummarySection;
