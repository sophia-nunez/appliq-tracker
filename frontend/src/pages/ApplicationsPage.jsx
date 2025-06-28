import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ApplicationLong from "../components/ApplicationLong";
import { useNavigate } from "react-router";
import "../styles/List.css";
import { getApplications } from "../utils/applicationUtils";
import { useEffect } from "react";

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
  }, []);

  // TODO: currently on all, move to applications list
  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  const loadApplications = async () => {
    const currQuery = new URLSearchParams({
      title: query.trim(),
      category: filter,
    });
    try {
      const data = await getApplications(currQuery);
      setApplications(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const addApplication = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };
  return (
    <>
      <main>
        <SearchBar pageName="Applications" />
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
        />
      )}
    </>
  );
};

export default ApplicationsPage;
