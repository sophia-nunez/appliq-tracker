import { useState, useEffect } from "react";
import {
  NavLink,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Modal from "../components/Modal";
import StatusButton from "../components/Status";
import { deleteApplication, getApplication } from "../utils/applicationUtils";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";
import { Tooltip } from "@mantine/core";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { setStatusOpen, setMessage } = useOutletContext();

  // application information
  const { appId } = useParams(); // id of application
  const [application, setApplication] = useState({});
  const [applicationDate, setApplicationDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [companyPage, setCompanyPage] = useState("."); // default is current page

  // modal visibility
  const [modalOpen, setModalOpen] = useState(false);

  // initial load
  useEffect(() => {
    loadApplication();
  }, []);

  // using given id, fetches application data and converts dates to strings
  const loadApplication = async () => {
    const loadedApplication = await getApplication(appId);
    const loadedDate = new Date(loadedApplication.appliedAt);

    // only convert interviewAt set if user gave interview date
    if (loadedApplication.interviewAt) {
      const interview = new Date(loadedApplication.interviewAt);
      setInterviewDate(interview.toLocaleDateString());
    }

    if (loadedApplication.companyId) {
      setCompanyPage(`../../companies/${loadedApplication.companyId}`);
    }

    setApplication(loadedApplication);
    setApplicationDate(loadedDate.toLocaleDateString());
  };

  // deletes application by id, otherwise sends alert
  const handleDelete = async () => {
    try {
      const deleted = await deleteApplication(appId);
      // uses navigation history to go back one page
      setMessage({ type: "success", text: "Application deleted." });
      setStatusOpen(true);
      navigate(-1);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete application." });
      setStatusOpen(true);
    }
  };

  return (
    <>
      <main className="application-detail-page">
        <div className="page-info">
          <NavLink to={-1} className="back-btn" end>
            <IoArrowBackCircleSharp />
          </NavLink>
          <div className="application-header">
            <h2>{application.title}</h2>
          </div>
          <div className="back-btn" />
        </div>
        <section className="application-details">
          <article className="company-info">
            <Tooltip label="Go to company page" position="bottom">
              <p className="company-text" onClick={() => navigate(companyPage)}>
                {application.company && application.company.name
                  ? application.company.name
                  : "No Company Assigned"}
              </p>
            </Tooltip>
          </article>
          <article className="label-text">
            <h4>Job description </h4>
            <p>{application.description}</p>
          </article>
          <div className="list-container user-details">
            <h3 className="status-details">
              Status | <StatusButton status={application.status} />
            </h3>
            <section className="list-content">
              <article className="child notes">
                <h4>Notes</h4>
                <p>{application.notes}</p>
              </article>
              <article className="child tags">
                <h4>Tags</h4>
                <div className="category-list">
                  {!application.categories ? (
                    <p>No tags</p>
                  ) : (
                    application.categories.map((category) => {
                      return (
                        <p className="tag" key={category.id}>
                          {category.name}
                        </p>
                      );
                    })
                  )}
                </div>
              </article>
              <article className="child dates">
                <div>
                  <h4>Application Date </h4>
                  <p> {applicationDate}</p>
                </div>
                <div>
                  <h4>Interview Date </h4>
                  {!interviewDate ? <p> None</p> : <p>{interviewDate}</p>}
                </div>
              </article>
            </section>
          </div>
          <section className="application-btns">
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
          contents="application"
          setModalOpen={setModalOpen}
          item={application}
          reloadPage={loadApplication}
        />
      )}
    </>
  );
};

export default ApplicationDetailPage;
