import List from "../components/List";
import SearchBar from "../components/SearchBar";

const ApplicationsPage = () => {
  return (
    <main>
      <SearchBar pageName="Applications" />
      <section className="list-container">
        <h3>All</h3>
        <List />
      </section>
    </main>
  );
};

export default ApplicationsPage;
