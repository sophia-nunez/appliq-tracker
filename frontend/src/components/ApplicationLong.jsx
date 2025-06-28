import Status from "./Status";
import "../styles/List.css";
import { useEffect, useState } from "react";

const ApplicationLong = ({
  openPage,
  id,
  companyName,
  title,
  description,
  appliedAt,
  status,
}) => {
  const [applicationDate, setApplicationDate] = useState("");

  // formats date to string for display
  useEffect(() => {
    const loadedDate = new Date(appliedAt);
    setApplicationDate(loadedDate.toLocaleDateString());
  }, []);

  return (
    <article className="application long" onClick={(e) => openPage(e, id)}>
      <div className="text">
        <p>{companyName}</p>
        <h4>{title}</h4>
        <p className="ellipsis-overflow">{description}</p>
      </div>
      <div className="details">
        <Status status={status} />
        <p>{applicationDate}</p>
      </div>
    </article>
  );
};

export default ApplicationLong;
