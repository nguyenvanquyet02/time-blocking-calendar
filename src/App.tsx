import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./index.css";
import { createContext, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";

export const ThemeContext = createContext<
  [string, (theme: string) => void] | null
>(null);

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeContext.Provider>
  );
}

export default App;
