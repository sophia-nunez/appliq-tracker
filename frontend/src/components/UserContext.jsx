import { createContext, useState, useContext, useEffect } from "react";
import { baseURL } from "../utils/authUtils";

const UserContext = createContext();

export const UserProvider = ({ setIsLoading, children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    setIsLoading(true);
    fetch(`${baseURL()}/me`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser({ ...user, ...data });
        }
        setIsLoading(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
