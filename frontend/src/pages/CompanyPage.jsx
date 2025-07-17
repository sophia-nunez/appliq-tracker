import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaCirclePlus } from "react-icons/fa6";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CompanyLong from "../components/CompanyLong.jsx";
import { getCompanies } from "../utils/companyUtils.js";
import { useLoading } from "../components/LoadingContext.jsx";

const CompanyPage = () => {
  const { loading } = useLoading();
  const [companies, setCompanies] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);
  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, [query, orderBy]);

  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads company based on query state variables (defaults to no search params)
  const loadCompanies = async () => {
    loading.setTrue();
    const currQuery = new URLSearchParams({
      name: query.trim(),
      industry: filter,
      orderBy,
    });
    try {
      const data = await getCompanies(currQuery);
      setCompanies(data);
    } catch (error) {
      alert(error.message);
    }
    loading.setFalse();
  };

  // opens modal to add company
  const addCompany = () => {
    setModalOpen(true);
  };

  return (
    <>
      <main className="company-page">
        <SearchBar
          pageName="Companies"
          query={query}
          setQuery={setQuery}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          handleSearch={loadCompanies}
        />
        <section className="list-container">
          <div className="list-header">
            <h3 style={{ margin: 10 + "px" }}>All</h3>
            <FaCirclePlus className="add-btn" onClick={addCompany} />
          </div>
          <section className="list-content">
            {companies && companies.length > 0 ? (
              companies.map((company) => {
                return (
                  <CompanyLong
                    openPage={openPage}
                    key={company.id}
                    id={company.id}
                    name={company.name}
                    industry={company.industry}
                    description={company.description}
                    careerPage={company.careerPage}
                    isFavorite={company.isFavorite}
                  />
                );
              })
            ) : (
              <div className="no-display">
                <h2>No companies to display.</h2>
                <p>
                  Click the <FaCirclePlus /> above to add a company!
                </p>
              </div>
            )}
          </section>
        </section>
      </main>
      {modalOpen && (
        <Modal
          contents="company"
          setModalOpen={setModalOpen}
          item={{}}
          reloadPage={loadCompanies}
        />
      )}
    </>
  );
};

export default CompanyPage;
