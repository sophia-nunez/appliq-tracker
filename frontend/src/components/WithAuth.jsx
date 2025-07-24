import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";
import { homePath, loginPath } from "../data/links.js";
import LoadingModal from "./LoadingModal.jsx";

const WithAuth = (type, loadingUser, WrappedComponent) => {
  if (type === "protected") {
    return function ProtectedComponent(props) {
      const { user } = useUser();

      // wait for useUser() to fetch before navigating
      const navigate = useNavigate();
      useEffect(() => {
        if (!loadingUser && !user.id) {
          navigate(loginPath);
        }
      }, [user, navigate]);

      if (loadingUser || !user.id) {
        return <LoadingModal />;
      }

      return <WrappedComponent {...props} />;
    };
  }

  return function UnprotectedComponent(props) {
    const { user } = useUser();

    // wait for useUser() to fetch before navigating
    const navigate = useNavigate();
    useEffect(() => {
      if (!loadingUser && user.id) {
        navigate(homePath);
      }
    }, [user, navigate]);

    if (loadingUser || user.id) {
      return <LoadingModal />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
