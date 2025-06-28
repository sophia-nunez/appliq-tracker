import { Link } from "react-router";
import "../styles/List.css";
import { applicationsPath } from "../links";

const List = () => {
  // static component for dev purposes and styling
  return (
    <section className="list-content" to={`${applicationsPath}/1`}>
      <article className="child">
        <div className="text">
          <h4>Title</h4>
          <p>Description</p>
        </div>
        <div className="buttons">
          <button>Delete</button>
        </div>
      </article>
      <article className="child">
        <div className="text">
          <h4>Title</h4>
          <p>Description</p>
        </div>
        <div className="buttons">
          <button>Delete</button>
        </div>
      </article>
    </section>
  );
};

export default List;
