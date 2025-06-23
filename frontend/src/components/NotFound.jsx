import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1> 404 Page Not Found</h1>
      <Link to="/">Back to Appliq Home</Link>
    </div>
  );
};

export default NotFound;
