import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/images/icon-1.png";

function Navbar() {
   const location = useLocation();
  return (
    <nav className="bg-gradient-to-b from-[#f6eafb] to-[#d9d9d9] sm:h-[98vh] rounded-lg m-1 p-1 flex flex-col sm:block">
      {/* Logo and App Name */}
      <div className="flex items-center justify-center pt-4 pb-4 sm:pt-10 sm:pb-10">
        <img src={logo} alt="Logo" className="h-12 w-12 mr-3" />
        <h1 className="text-black text-2xl font-bold">TrackEx</h1>
      </div>

      {/* Navigation Links */}
      <ul className="flex sm:flex-col sm:space-y-4 space-x-4 sm:space-x-0 justify-center">
        <li className="w-full">
          <NavLink
            to="/home/projects"
            className={({ isActive }) =>
              `block w-full sm:w-auto text-black font-bold py-2 px-4 ${
                isActive || location.pathname === "/home"
                  ? "bg-purple-500 rounded text-gray-200"
                  : "hover:bg-[#dba6ed] rounded hover:text-gray-200"
              }`
            }
          >
            Projects
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/home/members"
            className={({ isActive }) =>
              `block w-full text-black font-bold py-2 px-4 ${
                isActive
                  ? "bg-purple-500 rounded text-gray-200"
                  : "hover:bg-[#dba6ed] rounded hover:text-gray-200"
              }`
            }
          >
            Members
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/home/expenses"
            className={({ isActive }) =>
              `block w-full text-black font-bold py-2 px-4 ${
                isActive
                  ? "bg-purple-500 rounded text-gray-200"
                  : "hover:bg-[#dba6ed] rounded hover:text-gray-200"
              }`
            }
          >
            Expenses
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/home/settings"
            className={({ isActive }) =>
              `block w-full text-black font-bold py-2 px-4 ${
                isActive
                  ? "bg-purple-500 rounded text-gray-200"
                  : "hover:bg-[#dba6ed] rounded hover:text-gray-200"
              }`
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
