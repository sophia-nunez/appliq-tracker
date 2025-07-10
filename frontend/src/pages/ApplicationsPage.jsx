import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaCirclePlus } from "react-icons/fa6";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ApplicationLong from "../components/ApplicationLong";
import { getApplications } from "../utils/applicationUtils";
import { getCategories } from "../utils/categoryUtils";
import "../styles/List.css";
import "../styles/CategoryDropdown.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState(Array());
  const [categoriesList, setCategoriesList] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);
  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, [query, filter]);

  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads application based on query state variables (defaults to no search params)
  const loadApplications = async () => {
    const currQuery = new URLSearchParams({
      text: query.trim(),
      category: filter,
    });
    try {
      const data = await getApplications(currQuery);
      const categories = await getCategories();

      setCategoriesList(categories);
      setApplications(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // opens modal to add application
  const addApplication = (e) => {
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
            <select
              name="category"
              id="category"
              className="category-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              {categoriesList &&
                categoriesList.map((cat) => {
                  return (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  );
                })}
            </select>
            <FaCirclePlus className="add-btn" onClick={addApplication} />
          </div>
          <section className="list-content">
            {applications && applications.length > 0 ? (
              applications.map((application) => {
                return (
                  <ApplicationLong
                    openPage={openPage}
                    reloadPage={loadApplications}
                    key={application.id}
                    id={application.id}
                    companyName={application.companyName}
                    title={application.title}
                    description={application.description}
                    appliedAt={application.appliedAt}
                    status={application.status}
                    isFeatured={application.isFeatured}
                  />
                );
              })
            ) : (
              <div className="no-display">
                <h2>No applications to display.</h2>
                <p>
                  Click the <FaCirclePlus /> above to add an application!
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
      {modalOpen && (
        <Modal
          contents="application"
          setModalOpen={setModalOpen}
          item={{}}
          reloadPage={loadApplications}
        />
      )}
    </>
  );
};

export default ApplicationsPage;
