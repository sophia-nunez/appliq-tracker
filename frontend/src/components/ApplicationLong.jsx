import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Status from "./Status";
import "../styles/List.css";
import { editApplication } from "../utils/applicationUtils";

const ApplicationLong = ({
  openPage,
  reloadPage,
  id,
  companyName,
  title,
  description,
  appliedAt,
  status,
  isFeatured,
}) => {
  const [applicationDate, setApplicationDate] = useState("");
  const [featured, setFeatured] = useState(isFeatured);

  // formats date to string for display
  useEffect(() => {
    const loadedDate = new Date(appliedAt);
    setApplicationDate(loadedDate.toLocaleDateString());
  }, []);

  const toggleFeatured = async (e) => {
    e.stopPropagation();
    const toggledFav = !featured;

    const application = await editApplication({ isFeatured: toggledFav }, id);

    setFeatured((prev) => !prev);
    reloadPage();
  };

  return (
    <article className="application long" onClick={(e) => openPage(e, id)}>
      <div className="text">
        <p>{companyName}</p>
        <h4>{title}</h4>
        <p className="ellipsis-overflow">{description}</p>
      </div>
      <div className="details">
        <div className="details" onClick={toggleFeatured}>
          {featured ? (
            <FaHeart className="featured" />
          ) : (
            <FaRegHeart className="not-featured" />
          )}
        </div>
        <Status status={status} />
        <p>{applicationDate}</p>
      </div>
    </article>
  );
};

export default ApplicationLong;
