import { NavLink, useParams } from "react-router";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import List from "../components/List";
import { applicationsPath } from "../links";
import "../styles/Subpage.css";

const ApplicationDetailPage = () => {
  const { id } = useParams(); // id of application

  return (
    <main>
      <div className="page-info">
        <NavLink to={applicationsPath} className="back-btn" end>
          <IoArrowBackCircleSharp />
        </NavLink>
        <h2>Job Title</h2>
        <div className="back-btn" />
      </div>
      <section className="application-details">
        <button>Company</button>
        <p>Description of the job position, including the...</p>
        <section className="application-status">
          <h3>Status</h3>
          <div className="status-details">
            <List />
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
