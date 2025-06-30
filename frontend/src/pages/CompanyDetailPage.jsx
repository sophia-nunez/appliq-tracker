import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Modal from "../components/Modal";
import { deleteCompany, getCompany } from "../utils/companyUtils";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  // company information
  const { companyId } = useParams(); // id of company
  const [company, setCompany] = useState({});
  // modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  // initial load
  useEffect(() => {
    loadCompany();
  }, []);

  // using given id, fetches company data and converts dates to strings
  const loadCompany = async () => {
    const loadedCompany = await getCompany(companyId);

    setCompany(loadedCompany);
  };

  // deletes company by id, otherwise sends alert
  const handleDelete = async () => {
    try {
      const deleted = await deleteCompany(companyId);
      navigate(-1);
    } catch (error) {
      alert("Failed to delete company");
    }
  };

  return (
    <>
      <main className="company-detail-page">
        <div className="page-info">
          <NavLink to={-1} className="back-btn" end>
            <IoArrowBackCircleSharp />
          </NavLink>
          <div className="company-header">
            <h2>{company.name}</h2>
            <button>
              {company.careerPage ? (
                <a href={company.careerPage}>Career Page</a>
              ) : (
                "No Career Page Linked"
              )}
            </button>
          </div>
          <div className="back-btn" />
        </div>
        <section className="company-details">
          <p>Company description: {company.description}</p>
          <div className="list-container user-details">
            <section className="list-content">
              <article className="child tags">
                <h4>Industry</h4>
                {!company.industry ? (
                  <p>No industry</p>
                ) : (
                  <p>{company.industry}</p>
                )}
              </article>
            </section>
          </div>
          <section className="company-btns">
            <button className="edit-btn" onClick={() => setModalOpen(true)}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </section>
        </section>
      </main>
      {modalOpen && (
        <Modal
          contents="company"
          setModalOpen={setModalOpen}
          company={company}
          reloadPage={loadCompany}
        />
      )}
    </>
  );
};

export default CompanyDetailPage;
