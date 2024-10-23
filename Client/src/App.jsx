import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import RegisterUser from './components/register'; 
import LoginUser from "./components/login";
import Landing from './components/landing';
import Home from './components/home';

function App() {
  return (
    <div>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/login" element={<LoginUser />} />
            <Route path="/home*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
