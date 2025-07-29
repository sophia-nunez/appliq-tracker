import { createContext, useState, useContext, useEffect } from "react";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { useUser } from "./UserContext";
import { Scheme } from "../data/enums";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useUser();
  // check the device preferred to set the initial value
  const getPreferredTheme = () => {
    if (user && user.colorScheme) {
      return user.colorScheme;
    } else if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Scheme.DARK
        : Scheme.LIGHT;
    }
    return Scheme.LIGHT;
  };

  // set with initlial value as device preferred
  const [theme, setTheme] = useState(getPreferredTheme());

  useEffect(() => {
    setTheme(user.colorScheme);
  }, [user]);

  const value = { theme, setTheme };

  // return context provider to wrap app in
  return (
    <ThemeContext.Provider value={value}>
      <MantineProvider
        forceColorScheme={theme}
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
