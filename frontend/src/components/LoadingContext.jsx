import { createContext, useState, useContext, useCallback } from "react";
import LoadingModal from "./LoadingModal";

const LoadingContext = createContext();

// uses customized useBoolean hook
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // with useCallback to prevent infinite render loop
  const toggle = useCallback(() => setIsLoading((prev) => !prev), []);
  const setTrue = useCallback(() => setIsLoading(true), []);
  const setFalse = useCallback(() => setIsLoading(false), []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, loading: { toggle, setTrue, setFalse } }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
