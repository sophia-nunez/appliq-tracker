import { Link } from "react-router";
import { homePath } from "../links";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1> 404 Page Not Found</h1>
      <Link to={homePath}>Back to Appliq Home</Link>
    </div>
  );
};

export default NotFound;
