import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { FaCirclePlus } from "react-icons/fa6";
// Pagination component from https://mantine.dev/core/pagination/
import { Pagination } from "@mantine/core";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ApplicationLong from "../components/ApplicationLong";
import { getApplications, getTotalPages } from "../utils/applicationUtils";
import { getCategories } from "../utils/categoryUtils";
import { useLoading } from "../components/LoadingContext";
import "../styles/List.css";
import "../styles/CategoryDropdown.css";

const ApplicationsPage = () => {
  const { loading } = useLoading();
  const [applications, setApplications] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState(Array());

  // page management
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("all");
  const navigate = useNavigate();

  const { setMessage, setStatusOpen } = useOutletContext();

  useEffect(() => {
    loadApplications();
  }, [query, filter, orderBy, activePage]);

  // gets total pages
  useEffect(() => {
    async function getPages() {
      const pages = await getTotalPages(
        new URLSearchParams({
          text: query.trim(),
          category: filter,
        })
      );
      setTotalPages(pages);
    }

    getPages();
  }, [query]);

  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads application based on query state variables (defaults to no search params)
  const loadApplications = async () => {
    loading.setTrue();
    const currQuery = new URLSearchParams({
      page: activePage,
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
      setMessage({
        type: "error",
        text: error.message || "Failed to load applications.",
      });
      setStatusOpen(true);
    }
    loading.setFalse();
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
          <Pagination
            className="page-numbers"
            value={activePage}
            onChange={setPage}
            total={totalPages}
          />
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
