import { Link, useOutletContext } from "react-router";
import Featured from "../components/Featured";
import List from "../components/List";
import { applicationsPath, companiesPath, dataPath } from "../data/links";
import "../styles/HomePage.css";
import { useEffect } from "react";
import { findInterviewTimes } from "../utils/oauthUtils";

const HomePage = () => {
  // pop up on form submission
  const { setStatusOpen, setMessage, setInterviewChanged } = useOutletContext();

  useEffect(() => {
    try {
      // find interviews from email and ask to add to calendar
      addInterviews();
    } catch (error) {
      console.log("Failed to find new interview times.");
    }
  }, []);

  const addInterviews = async () => {
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
  };

  return (
    <main>
      <h2>Home</h2>
      <nav className="home-nav">
        <Link to={applicationsPath}>Applications</Link>
        <Link to={companiesPath}>Companies</Link>
        <Link to={dataPath}>Data</Link>
      </nav>
      <section className="featured-container">
        <Featured />
      </section>
      <section className="featured-container">
        <h3>Notes</h3>
        <List />
      </section>
    </main>
  );
};

export default HomePage;
