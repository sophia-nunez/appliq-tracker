import { createContext, useState, useContext } from "react";
import {
  Button,
  Paper,
  MantineProvider,
  useMantineColorScheme,
} from "@mantine/core";

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
  const preferredTheme = getPreferredTheme();
  const [theme, setTheme] = useState("light");
  const { setColorScheme } = useMantineColorScheme();

  // sets to opposite theme (toggles)
  const toggleTheme = () => {
    const currentTheme = theme;
    setTheme(currentTheme === "light" ? "dark" : "light");
    setColorScheme(currentTheme === "light" ? "dark" : "light");
  };

  const value = { theme, toggleTheme };

  // return context provider to wrap app in
  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider
        theme={{ colorScheme: theme }}
        withGlobalStyles
        withNormalizeCSS
      >
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
};

// custom hook using theme context
export const useTheme = () => useContext(ThemeContext);
