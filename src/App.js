import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedPage from "./components/ProtectedPage";
import Profile from "./pages/Profile";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";


function App() {
  const {loading} = useSelector((state)=> state.loaders);
  return (
    <div>
      {loading && <Loader />}
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* protected routes */}
          <Route path="/" element={<ProtectedPage>
            <Home />
          </ProtectedPage>}
          />
          <Route path="/project/:id" element={<ProtectedPage>
            <ProjectDetail />
          </ProtectedPage>}
          />
          <Route path="/profile" element={<ProtectedPage>
            <Profile />
          </ProtectedPage>}
          />
          {/* public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
