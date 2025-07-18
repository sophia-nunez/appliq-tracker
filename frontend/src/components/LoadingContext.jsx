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

  // only give set value, no isLoading
  return (
    <LoadingContext.Provider value={{ loading: { toggle, setTrue, setFalse } }}>
      {children}
      {isLoading && <LoadingModal />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
