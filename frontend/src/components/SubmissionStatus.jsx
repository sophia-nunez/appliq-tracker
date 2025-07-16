import { useEffect } from "react";
import "../styles/Popup.css";
import { createEvent } from "../utils/oauthUtils";
import { useUser } from "./UserContext";

const SubmissionStatus = ({
  setStatusOpen,
  setInterviewChanged,
  interviewChanged,
  setMessage,
  message,
}) => {
  const { user } = useUser();
  // closes popup on span click or after timeout
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        // close itself after time, 3 seconds normally or 6 if interview event
        setStatusOpen(false);
      },
      interviewChanged.date ? 6000 : 3000
    );

    function handleWindowClick(event) {
      const span = document.getElementById("popup-close");
      if (event.target === span) {
        setStatusOpen(false);
      }
    }

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const declineEvent = () => {
    setMessage({
      type: "success",
      text: "Calendar event creation declined.",
    });
    setInterviewChanged({});
  };

  const addEvent = () => {
    try {
      createEvent(interviewChanged);
      setMessage({
        type: "success",
        text: "Interview added to calendar!",
      });
      setInterviewChanged({});
    } catch (error) {
      setMessage({
        type: "error",
        text: "Interview could not be added to calendar.",
      });
    }
  };

  return (
    <aside className="popup" id="submission-status">
      <section className={`popup-content ${message.type}`}>
        <span id="popup-close" className="close-icon">
          x
        </span>
        <div className="popup-text">
          <p className={`${message.type}-text`}>{message.text}</p>
          {interviewChanged.date && user.type === "google" && (
            <>
              <h5>Would you like to add this event to your calendar?</h5>

              <div className="buttons">
                <button onClick={addEvent}>Yes</button>
                <button className="delete-btn" onClick={declineEvent}>
                  No
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </aside>
  );
};
export default SubmissionStatus;
