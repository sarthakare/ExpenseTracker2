import { Link } from "react-router-dom";
import logo from "../assets/images/icon-1.png";

function Navbar() {
  return (
    <nav className="bg-gradient-to-b from-[#f6eafb] to-[#d9d9d9] h-[98vh] rounded-lg m-1 p-1">
      {/* Logo and App Name */}
      <div className="flex items-center justify-center pt-10 pb-10">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-3" />
        <h1 className="text-black text-2xl font-bold">TrackEx</h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col space-y-4">
        <li className="w-full hover:bg-[#dba6ed]">
          <Link
            to="/home/projects"
            className="block w-full text-black font-bold py-2 px-4 hover:text-gray-200"
          >
            Projects
          </Link>
        </li>
        <li className="w-full hover:bg-[#dba6ed]">
          <Link
            to="/home/members"
            className="block w-full text-black font-bold py-2 px-4 hover:text-gray-200"
          >
            Members
          </Link>
        </li>
        <li className="w-full hover:bg-[#dba6ed]">
          <Link
            to="/home/expenses"
            className="block w-full text-black font-bold py-2 px-4 hover:text-gray-200"
          >
            Expenses
          </Link>
        </li>
        <li className="w-full hover:bg-[#dba6ed]">
          <Link
            to="/home/settings"
            className="block w-full text-black font-bold py-2 px-4 hover:text-gray-200"
          >
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
