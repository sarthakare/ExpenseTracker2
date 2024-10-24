import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Expenses = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        setUser(userResponse.data);

        const projectsResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/users/${userResponse.data.id}/projects`
        );
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user or project data."); // Error toast
      }
    };

    if (email) {
      fetchUserData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!expenseName || !amount || !date || !user.id || !projects.length) {
      toast.error("Please fill out all fields."); // Error toast for validation
      return;
    }

    try {
      await axios.post("https://expensetracker2-1.onrender.com/expenses", {
        project_id: selectedProjectId,
        member_id: user.id,
        expense_name: expenseName,
        amount: parseFloat(amount),
        expense_date: date || null,
      });

      toast.success("Expense added successfully!"); // Success toast

      // Reset the form fields
      setExpenseName("");
      setAmount("");
      setDate("");
      setSelectedProjectId("");
    } catch (err) {
      const errorMessage =
        "Failed to add expense. " + (err.response?.data?.detail || err.message);
      toast.error(errorMessage); // Error toast
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-10 grid-rows-10 gap-4 p-1">
      <div className="col-start-1 col-span-10 bg-white rounded-lg font-bold flex items-center pl-5">
        welcome {user.name},
      </div>
      <div className="col-start-1 col-span-4 row-start-2 row-span-9">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Add Expense
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Member Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Member:
              </label>
              <input
                type="text"
                value={user.name || ""}
                disabled
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            {/* Project Select Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Project:
              </label>
              <select
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Name Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Expense Name:
              </label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter expense name"
              />
            </div>

            {/* Amount Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Amount:
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter amount"
              />
            </div>

            {/* Date Field */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-500 ease-in-out"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
