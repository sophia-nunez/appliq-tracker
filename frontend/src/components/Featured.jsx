import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { getFeatured } from "../utils/applicationUtils";
import Status from "./Status";
import "../styles/Featured.css";
import { useLoading } from "./LoadingContext";

const Featured = () => {
  const { setIsLoading } = useLoading();
  const [featured, setFeatured] = useState(Array());
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
    setIsLoading(true);
    try {
      const data = await getFeatured();
      const slicedFeatured = data.slice(0, 5);

      setFeatured(slicedFeatured);
    } catch (error) {
      alert(error.message);
    }
    setIsLoading(false);
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
                    <p className="favorite-status">Favorite</p>
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
