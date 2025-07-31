import { Link, useOutletContext } from "react-router";
import Featured from "../components/Featured";
import List from "../components/List";
import { applicationsPath, companiesPath, dataPath } from "../data/links";
import "../styles/HomePage.css";
import { useEffect, useState } from "react";
import { findInterviewTimes } from "../utils/oauthUtils";
import { trackLogin } from "../utils/authUtils";

const HomePage = () => {
  // pop up on form submission
  const { setStatusOpen, setMessage, setInterviewChanged } = useOutletContext();
  const [interviewsAdded, setInterviewsAdded] = useState(0);

  useEffect(() => {
    try {
      // find interviews from email and ask to add to calendar
      loginHome();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to find interview times from email. Please try again later.",
      });
      setStatusOpen(true);
    }
  }, []);

  const loginHome = async () => {
    // on load, search and set interviews from email
    const interviews = await findInterviewTimes();

    // if interviews are found, display popup asking to add these to calendar
    if (interviews && interviews.length > 0) {
      setMessage({
        type: "success",
        text: `${interviews.length} new interviews were loaded from your inbox. Displaying optional event creations...`,
      });
      setStatusOpen(true);
      interviews.forEach(function (interview, index) {
        const timeout = setTimeout(
          () => {
            setInterviewChanged(interview);
            setMessage({
              type: "success",
              text: `Interview (${index + 1}/${interviews.length}): ${
                interview.title
              }.`,
            });
            setStatusOpen(true);
          },
          index === 0 ? 3500 : 6500 * (index + 1)
        );
      });
    }

    await trackLogin();
    await setInterviewsAdded(interviewsAdded + 1);
  };

  return (
    <main className="home-page" style={{ width: "100vw" }}>
      <h2>Home</h2>
      <section className="featured-container">
        <Featured interviewsAdded={interviewsAdded} />
      </section>
      <section className="tasks-container">
        <section className="home-container">
          <h3>Tasks</h3>
          <List />
        </section>
      </section>
    </main>
  );
};

export default HomePage;
