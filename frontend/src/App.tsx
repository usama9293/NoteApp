import { Route,BrowserRouter,Navigate, Routes } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import Login from "./Pages/LoginPage";
import Notes from "./Pages/NotesPage";
import Register from "./Pages/RegisterPage";



function App() {

  return (
    
      <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
       </AuthProvider>
      </BrowserRouter>
    
  );


}



export default App;