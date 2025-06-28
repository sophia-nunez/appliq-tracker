import { useEffect, useState } from "react";
import "../styles/Status.css";
const Status = ({ status }) => {
  const [statusText, setStatusText] = useState("");

  // set text and class for display
  useEffect(() => {
    setStatusText(status);
  }, [status]);

  return <button className={`status-btn ${status}`}>{statusText}</button>;
};

export default Status;
