import { createContext, useContext, useState } from "react";
import { lightTheme, darkTheme } from "@/Constants/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
