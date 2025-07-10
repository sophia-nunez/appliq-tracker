import DataDisplay from "../components/DataDisplay";
import SankeyChart from "../components/SankeyChart";
import SummaryChart from "../components/SummaryChart";
import SummarySection from "../components/SummarySection";
import "../styles/DataPage.css";

const DataPage = () => {
  return (
    <main className="data-page">
      <h2>Data</h2>
      <section className="data-list">
        <SummarySection />
        <DataDisplay />
      </section>
    </main>
  );
};

export default DataPage;
