import { createContext, useState, useContext, useEffect } from "react";
import { baseURL } from "../utils/authUtils";
import { useLoading } from "./LoadingContext";

const UserContext = createContext();

export const UserProvider = ({ setLoadingUser, children }) => {
  const [user, setUser] = useState({});

  // on render, fetches current user
  useEffect(() => {
    setLoadingUser(true);
    fetch(`${baseURL()}/me`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser({ ...user, ...data });
        }
        setLoadingUser(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
