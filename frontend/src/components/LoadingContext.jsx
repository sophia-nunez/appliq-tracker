import { createContext, useState, useContext, useCallback } from "react";
import LoadingModal from "./LoadingModal";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // avoids infinite render loop
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
  }, []);

  // only give set value, no isLoading
  return (
    <LoadingContext.Provider value={{ setIsLoading: setLoading }}>
      {children}
      {isLoading && <LoadingModal />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
