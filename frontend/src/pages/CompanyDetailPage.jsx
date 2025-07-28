import { useState, useEffect } from "react";
import {
  NavLink,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import ApplicationLong from "../components/ApplicationLong";
import Modal from "../components/Modal";
import { deleteCompany, getCompany } from "../utils/companyUtils";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";
import { companiesPath } from "../data/links";

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  const { setStatusOpen, setMessage } = useOutletContext();

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

  const openPage = (e, id) => {
    e.preventDefault();
    navigate(`../applications/${id}`);
  };

  // deletes company by id, otherwise sends alert
  const handleDelete = async () => {
    try {
      const deleted = await deleteCompany(companyId);
      navigate(-1);
      setMessage({ type: "success", text: `Company deleted: ${deleted.name}` });
      setStatusOpen(true);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete company." });
      setStatusOpen(true);
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
          </div>
          <div className="back-btn" />
        </div>
        <section className="company-details">
          <button>
            {company.careerPage ? (
              <a
                className="website-URL"
                href={
                  company.careerPage.startsWith("http")
                    ? company.careerPage
                    : `https://${company.careerPage}`
                }
                target="_blank"
              >
                Career Page
              </a>
            ) : (
              "No Career Page Linked"
            )}
          </button>
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
              <article className="child description">
                <h4>Description</h4>
                <p>{company.description}</p>
              </article>
              <article className="child company-apps">
                <h4>Applications</h4>
                <div className="apps-list">
                  {(company.applications && company.applications.length) > 0 ? (
                    company.applications.map((application) => {
                      return (
                        <ApplicationLong
                          openPage={openPage}
                          reloadPage={loadCompany}
                          key={application.id}
                          id={application.id}
                          companyName={company.name}
                          title={application.title}
                          description={application.description}
                          appliedAt={application.appliedAt}
                          status={application.status}
                          isFeatured={application.isFeatured}
                        />
                      );
                    })
                  ) : (
                    <p>No associated applications.</p>
                  )}
                </div>
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
          item={company}
          reloadPage={loadCompany}
        />
      )}
    </>
  );
};

export default CompanyDetailPage;
