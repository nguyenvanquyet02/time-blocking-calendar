import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './index.css';
import { createContext, useState } from 'react';

export const ThemeContext = createContext<[string, (theme: string) => void] | null>(null);

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <RouterProvider router={router} />
    </ThemeContext.Provider>
  );
}

export default App;
