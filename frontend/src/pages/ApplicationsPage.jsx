import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ApplicationLong from "../components/ApplicationLong";
import { getApplications } from "../utils/applicationUtils";
import "../styles/List.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);
  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, [query]);

  // TODO: currently on all, move to applications list
  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads application based on query state variables (defaults to no search params)
  const loadApplications = async () => {
    console.log("loaded");
    const currQuery = new URLSearchParams({
      text: query.trim(),
      category: filter,
    });
    try {
      const data = await getApplications(currQuery);
      setApplications(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // opens modal to add application
  const addApplication = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };
  return (
    <>
      <main>
        <SearchBar
          pageName="Applications"
          query={query}
          setQuery={setQuery}
          handleSearch={loadApplications}
        />
        <section className="list-container">
          <div className="list-header">
            <h3>All</h3>
            <p onClick={addApplication}>+</p>
          </div>
          <section className="list-content">
            {applications &&
              applications.map((application) => {
                return (
                  <ApplicationLong
                    openPage={openPage}
                    key={application.id}
                    id={application.id}
                    companyName={application.companyName}
                    title={application.title}
                    description={application.description}
                    appliedAt={application.appliedAt}
                    status={application.status}
                  />
                );
              })}
          </section>
        </section>
      </main>
      {modalOpen && (
        <Modal
          contents="application"
          setModalOpen={setModalOpen}
          application={{}}
          reloadPage={loadApplications}
        />
      )}
    </>
  );
};

export default ApplicationsPage;
