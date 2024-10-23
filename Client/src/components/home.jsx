import { Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import Projects from "./projects";
import Members from "./members";
import Expenses from "./expenses";
import Settings from "./settings";

function Home() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Projects/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/members" element={<Members />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default Home;
