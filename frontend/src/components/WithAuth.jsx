import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";
import { loginPath } from "../links.js";

const WithAuth = (isLoading, WrappedComponent) => {
  return function ProtectedComponent(props) {
    const { user } = useUser();

    // TODO: wait for useUser() to fetch before navigating
    const navigate = useNavigate();
    useEffect(() => {
      if (!isLoading && !user.id) {
        navigate(loginPath);
      }
    }, [user, navigate]);

    if (isLoading || !user.id) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
