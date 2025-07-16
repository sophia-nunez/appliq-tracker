import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaCirclePlus } from "react-icons/fa6";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ApplicationLong from "../components/ApplicationLong";
import SubmissionStatus from "../components/SubmissionStatus";
import { getApplications } from "../utils/applicationUtils";
import { getCategories } from "../utils/categoryUtils";
import { useLoading } from "../components/LoadingContext";
import "../styles/List.css";
import "../styles/CategoryDropdown.css";

const ApplicationsPage = () => {
  const { setIsLoading } = useLoading();
  const [applications, setApplications] = useState(Array());
  const [categoriesList, setCategoriesList] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);

  // pop up on form submission
  const [message, setMessage] = useState({
    type: "success",
    text: "Changes saved!",
  }); // error or success message
  const [statusOpen, setStatusOpen] = useState(false);
  // track if interview date is modified for calendar addition
  const [interviewChanged, setInterviewChanged] = useState({});

  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, [query, filter, orderBy]);

  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads application based on query state variables (defaults to no search params)
  const loadApplications = async () => {
    setIsLoading(true);
    const currQuery = new URLSearchParams({
      text: query.trim(),
      category: filter,
      orderBy,
    });
    try {
      const data = await getApplications(currQuery);
      const categories = await getCategories();

      setCategoriesList(categories);
      setApplications(data);
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
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
          orderBy={orderBy}
          setOrderBy={setOrderBy}
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
        {statusOpen && (
          <SubmissionStatus
            setStatusOpen={setStatusOpen}
            setInterviewChanged={setInterviewChanged}
            interviewChanged={interviewChanged}
            setMessage={setMessage}
            message={message}
          />
        )}
      </main>
      {modalOpen && (
        <Modal
          contents="application"
          setModalOpen={setModalOpen}
          item={{}}
          reloadPage={loadApplications}
          setStatusOpen={setStatusOpen}
          setInterviewChanged={setInterviewChanged}
          setMessage={setMessage}
        />
      )}
    </>
  );
};

export default ApplicationsPage;
