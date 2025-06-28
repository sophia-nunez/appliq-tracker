import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { getApplication } from "../utils/applicationUtils";
import Status from "../components/Status";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  const { appId } = useParams(); // id of application
  const [application, setApplication] = useState({});
  const [applicationDate, setApplicationDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [companyPage, setCompanyPage] = useState(".");

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    const loadedApplication = await getApplication(appId);
    const loadedDate = new Date(loadedApplication.appliedAt);

    // only set if user gave interview date
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

  return (
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
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </section>
      </section>
    </main>
  );
};

export default ApplicationDetailPage;
