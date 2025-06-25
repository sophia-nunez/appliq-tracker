import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";
import { loginPath } from "../links.js";

const WithAuth = (WrappedComponent) => {
  return function ProtectedComponent(props) {
    const { user } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
      if (!user.id) {
        navigate(loginPath);
      }
    }, [user, navigate]);

    if (!user.id) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
