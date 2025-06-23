import { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // check the device preferred to set the initial value
  const getPreferredTheme = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  // set with initlial value as device preferred
  const [theme, setTheme] = useState(getPreferredTheme);

  // sets to opposite theme (toggles)
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };

  // return context provider to wrap app in
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// custom hook using theme context
export const useTheme = () => useContext(ThemeContext);
