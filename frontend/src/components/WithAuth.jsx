import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "./UserContext";
import { loginPath } from "../links.js";
import LoadingModal from "./LoadingModal.jsx";

const WithAuth = (loadingUser, WrappedComponent) => {
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
};

export default WithAuth;
