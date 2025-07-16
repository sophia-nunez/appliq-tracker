import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Modal from "../components/Modal";
import Status from "../components/Status";
import SubmissionStatus from "../components/SubmissionStatus";
import { deleteApplication, getApplication } from "../utils/applicationUtils";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  // application information
  const { appId } = useParams(); // id of application
  const [application, setApplication] = useState({});
  const [applicationDate, setApplicationDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [companyPage, setCompanyPage] = useState("."); // default is current page

  // pop up on form submission
  const [message, setMessage] = useState({
    type: "success",
    text: "Changes saved!",
  }); // error or success message
  const [statusOpen, setStatusOpen] = useState(false);
  // track if interview date is modified for calendar addition
  const [interviewChanged, setInterviewChanged] = useState({});

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
      navigate(-1);
    } catch (error) {
      alert("Failed to delete application");
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
            <button onClick={() => navigate(companyPage)}>
              {application.companyName
                ? application.companyName
                : "No Company Assigned"}
            </button>
          </div>
          <div className="back-btn" />
        </div>
        <section className="application-details">
          <p>Job description: {application.description}</p>
          <div className="list-container user-details">
            <h3 className="status-details">
              Status | <Status status={application.status} />
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
          item={application}
          reloadPage={loadApplication}
          setStatusOpen={setStatusOpen}
          setInterviewChanged={setInterviewChanged}
          setMessage={setMessage}
        />
      )}
    </>
  );
};

export default ApplicationDetailPage;
