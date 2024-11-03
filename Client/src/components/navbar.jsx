import { NavLink } from "react-router-dom";
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
        <li className="w-full">
          <NavLink
            to="/home/projects"
            className={({ isActive }) =>
              `block w-full text-black font-bold py-2 px-4 ${
                isActive
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
