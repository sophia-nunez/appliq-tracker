import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { getApplication } from "../utils/applicationUtils";
import Status from "../components/Status";
import "../styles/Subpage.css";
import "../styles/ApplicationDetailPage.css";

const ApplicationDetailPage = () => {
  const { appId } = useParams(); // id of application
  const [application, setApplication] = useState({});

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    const loadedApplication = await getApplication(appId);

    setApplication(loadedApplication);
  };

  return (
    <main>
      <div className="page-info">
        <NavLink to={-1} className="back-btn" end>
          <IoArrowBackCircleSharp />
        </NavLink>
        <h2>{application.title}</h2>
        <div className="back-btn" />
      </div>
      <section className="application-details">
        <button>{application.companyName}</button>
        <p>{application.description}</p>
        <section className="application-status">
          <h3>
            Status | <Status status={application.status} />
          </h3>
          <div className="list-content status-details">
            <section className="list-content">
              <article className="child">
                <div className="text">
                  <h4>Title</h4>
                  <p>Description</p>
                </div>
                <div className="buttons">
                  <button>Delete</button>
                </div>
              </article>
              <article className="child">
                <div className="text">
                  <h4>Title</h4>
                  <p>Description</p>
                </div>
              </article>
            </section>
          </div>
        </section>
        <section className="application-btns">
          <button>Edit</button>
          <button>Delete</button>
        </section>
      </section>
    </main>
  );
};

export default ApplicationDetailPage;
