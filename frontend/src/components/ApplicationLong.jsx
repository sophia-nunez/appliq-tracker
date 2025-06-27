import Status from "./Status";
import "../styles/List.css";

const ApplicationLong = ({
  openPage,
  id,
  companyName,
  title,
  description,
  status,
}) => {
  return (
    <article className="application long" onClick={(e) => openPage(e, id)}>
      <div className="text">
        <span className="header-span">
          <h4>{title} plus slightly more text</h4>
          <p className="details">
            {companyName} | <Status status={status} />
          </p>
        </span>
        <p className="app-description">{description}</p>
      </div>
    </article>
  );
};

export default ApplicationLong;
