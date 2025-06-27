import { useEffect, useState } from "react";
import "../styles/Status.css";
const Status = ({ status }) => {
  const [statusText, setStatusText] = useState("");

  // set text and class for display
  useEffect(() => {
    if (status === "accepted") {
      setStatusText("Signed");
    } else if (status === "rejected") {
      setStatusText("Rejected");
    } else if (status === "interview") {
      setStatusText("Interview");
    } else if (status === "offer") {
      setStatusText("Offer");
    } else {
      setStatusText("Applied");
    }
  }, [status]);

  return <button className={`status-btn ${status}`}>{statusText}</button>;
};

export default Status;
