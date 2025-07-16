import { useEffect } from "react";
import "../styles/Popup.css";

const SubmissionStatus = ({
  setStatusOpen,
  setInterviewChanged,
  interviewChanged,
  setMessage,
  message,
}) => {
  // closes popup on span click or after timeout
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        // close itself after time, 3 seconds normally or 6 if interview event
        setStatusOpen(false);
        clearTimeout(timeout);
      },
      interviewChanged ? 6000 : 3000
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
      text: "Calendar event creation declined. Application successfully updated!",
    });
    setInterviewChanged(false);
  };

  return (
    <aside className="popup" id="submission-status">
      <section className={`popup-content ${message.type}`}>
        <span id="popup-close" className="close-icon">
          x
        </span>
        <div className="popup-text">
          {interviewChanged ? (
            <>
              <h5>
                A new interview date was added. Would you like to add this event
                to your calendar?
              </h5>

              <div className="buttons">
                <button>Yes</button>
                <button className="delete-btn" onClick={declineEvent}>
                  No
                </button>
              </div>
            </>
          ) : (
            <p className={`${message.type}-text`}>{message.text}</p>
          )}
        </div>
      </section>
    </aside>
  );
};
export default SubmissionStatus;
