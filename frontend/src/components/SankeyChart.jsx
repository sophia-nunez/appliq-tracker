import { Sankey } from "recharts";
import SankeyNode from "./SankeyNode";

const SankeyChart = ({ data }) => {
  // gets number of that status
  // TODO: take into account stages (i.e. any interviews were also Applications at a point)
  const getCount = (type) => {
    const filtered = data.filter((item) => {
      return item.name === type;
    });

    let count = 0;

    for (const item of filtered) {
      count += item.value;
    }

    return count;
  };

  const formattedData = {
    nodes: [
      {
        name: "Applied",
      },
      {
        name: "Rejected",
      },
      {
        name: "Interview",
      },
      {
        name: "Offer",
      },
      {
        name: "Signed",
      },
    ],
    links: [
      {
        source: 0, // rejected
        target: 1,
        value: 1,
      },
      {
        source: 0, // interview
        target: 2,
        value: 3,
      },
      {
        source: 2, // offer
        target: 3,
        value: 2,
      },
      {
        source: 3, // signed
        target: 4,
        value: 1,
      },
    ],
  };

  return (
    <Sankey
      width={960}
      height={500}
      data={formattedData}
      node={<SankeyNode />}
      nodePadding={50}
      margin={{
        left: 200,
        right: 200,
        top: 100,
        bottom: 100,
      }}
      link={{ stroke: "#77c878" }}
    ></Sankey>
  );
};

export default SankeyChart;
