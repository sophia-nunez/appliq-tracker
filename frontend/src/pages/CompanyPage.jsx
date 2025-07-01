import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import List from "../components/List.jsx";
import Modal from "../components/Modal.jsx";
import SearchBar from "../components/SearchBar.jsx";
import CompanyLong from "../components/CompanyLong.jsx";
import { getCompanies } from "../utils/companyUtils.js";

const CompanyPage = () => {
  const [companies, setCompanies] = useState(Array());
  const [modalOpen, setModalOpen] = useState(false);
  // search and nav
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, [query]);

  // TODO: currently on all, move to companies list
  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  // loads company based on query state variables (defaults to no search params)
  const loadCompanies = async () => {
    const currQuery = new URLSearchParams({
      name: query.trim(),
      industry: filter,
    });
    try {
      const data = await getCompanies(currQuery);
      setCompanies(data);
    } catch (error) {
      alert(error.message);
    }
  };

  // opens modal to add company
  const addCompany = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <main className="company-page">
        <SearchBar
          pageName="Companies"
          query={query}
          setQuery={setQuery}
          handleSearch={loadCompanies}
        />
        <section className="list-container">
          <div className="list-header">
            <h3 style={{ margin: 10 + "px" }}>All</h3>
            <p onClick={addCompany}>+</p>
          </div>
          <section className="list-content">
            {companies &&
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
              })}
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
