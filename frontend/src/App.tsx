import { useEffect, useState } from "react";
import { Route,BrowserRouter,Navigate, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Pages/LoginPage";
import Notes from "./Pages/NotesPage";
import Register from "./Pages/RegisterPage";
import NoteFormPage from "./Pages/NoteFormPage";



function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-shell">
      <BrowserRouter>
        <AuthProvider>
          <button
            type="button"
            onClick={toggleTheme}
            className="fixed right-4 top-4 z-50 rounded-full border border-ink-100/80 bg-white/90 px-3 py-2 text-xs font-semibold text-ink-700 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-night-800/90 dark:text-ink-50 dark:hover:bg-night-800"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/notes/new" element={<NoteFormPage />} />
            <Route path="/notes/:id/edit" element={<NoteFormPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );


}



export default App;