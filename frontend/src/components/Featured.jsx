import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { FaHeart } from "react-icons/fa";
import { getFeatured } from "../utils/applicationUtils";
import Status from "./Status";
import "../styles/Featured.css";
import { useLoading } from "./LoadingContext";

const Featured = () => {
  const { loading } = useLoading();
  const [featured, setFeatured] = useState(Array());
  const { setMessage, setStatusOpen } = useOutletContext();

  // search and nav
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const openApplicationPage = (e, id) => {
    e.preventDefault();
    navigate(`applications/${id}`);
  };

  // loads application based on query state variables (defaults to no search params)
  const loadApplications = async () => {
    loading.setTrue();
    try {
      const data = await getFeatured();
      const slicedFeatured = data.slice(0, 5);

      setFeatured(slicedFeatured);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to load featured applications.",
      });
      setStatusOpen(true);
    }
    loading.setFalse();
  };

  return (
    <section className="featured-container">
      <h3> Featured </h3>
      <section className="featured-background">
        <div className="featured-content">
          {(featured && featured.length) > 0 ? (
            featured.map((application) => {
              return (
                <article
                  key={application.id}
                  className="featured"
                  onClick={(e) => openApplicationPage(e, application.id)}
                >
                  <Status status={application.status} />
                  <h4>{application.title}</h4>
                  <p>{application.description}</p>
                  {application.isFeatured && (
                    <div className="favorite-status">
                      <FaHeart />
                    </div>
                  )}
                </article>
              );
            })
          ) : (
            <div className="no-display">
              <h2>Nothing to display.</h2>
              <p>
                Go to the <Link to="applications">Applications</Link> page to
                add an application!
              </p>
            </div>
          )}
        </div>
      </section>
    </section>
  );
};

export default Featured;
