import { Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import Projects from "./projects";
import Members from "./members";
import Expenses from "./expenses";
import Settings from "./settings";

function Home() {
  return (
    <div className="pl-1 pr-1 grid grid-cols-12 gap-2 bg-gradient-to-b from-blue-500 to-purple-700">
      {/* Navbar in the first two columns */}
      <div className="col-span-2">
        <Navbar />
      </div>

      {/* Main content in the remaining 10 columns */}
      <div className="col-span-10">
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/members" element={<Members />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}


export default Home;
