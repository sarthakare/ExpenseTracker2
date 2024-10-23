import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Expenses = () => {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Initialize as empty string
  const [expenseName, setExpenseName] = useState(""); // Initialize as empty string
  const [amount, setAmount] = useState(""); // Initialize as empty string
  const [date, setDate] = useState(""); // Initialize as empty string
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchUserData = async () => {
      try {
        // Fetch user details by email
        const userResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        setUser(userResponse.data);

        // Fetch the projects assigned to this user
        const projectsResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/users/${userResponse.data.id}/projects`
        );
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load user or project data.");
      }
    };

    if (email) {
      fetchUserData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!expenseName || !amount || !date || !user.id || !projects.length) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await axios.post("https://expensetracker2-1.onrender.com/expenses", {
        project_id: selectedProjectId, // Make sure selectedProjectId is controlled
        member_id: user.id, // Set the current logged-in user as the member
        expense_name: expenseName,
        amount: parseFloat(amount),
        expense_date: date || null,
      });

      setSuccess("Expense added successfully!");
      setExpenseName(""); // Reset field after submission
      setAmount(""); // Reset field after submission
      setDate(""); // Reset field after submission
      setSelectedProjectId(""); // Reset field after submission
    } catch (err) {
      setError(
        "Failed to add expense. " + (err.response?.data?.detail || err.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg transform transition-transform duration-300 ease-out">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Expense
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Member Field */}
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
  );
};

export default Expenses;
