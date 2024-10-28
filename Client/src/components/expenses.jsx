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
  const [expenseType, setExpenseType] = useState("");
  const [expenseDetail, setExpenseDetail] = useState("");
  const [expenseProof, setExpenseProof] = useState("");
  const [expenseStatus, setExpenseStatus] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        setUser(userResponse.data);

        const projectsResponse = await axios.get(
          `https://expensetracker2-1.onrender.com/projects`
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

useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const expensesResponse = await axios.get(
        `https://expensetracker2-1.onrender.com/expenses`
      );

      if (selectedProjectId) {
        // Filter expenses for the selected project
        const projectExpenses = expensesResponse.data.filter(
          (expense) => expense.project_id === parseInt(selectedProjectId)
        );
        setFilteredExpenses(projectExpenses);
      } else {
        setFilteredExpenses([]); // Clear expenses if no project is selected
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses.");
    }
  };

  fetchExpenses();
}, [selectedProjectId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !expenseName ||
      !amount ||
      !date ||
      !user.id ||
      !selectedProjectId ||
      !expenseType ||
      !expenseStatus
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const selectedProject = projects.find(
      (project) => project.id === parseInt(selectedProjectId)
    );

    const expenseData = {
      project_id: selectedProjectId,
      member_id: user.id,
      expense_name: expenseName,
      amount: parseInt(amount, 10),
      expense_date: date || null,
      project_name: selectedProject?.project_name || "Unknown Project",
      member_name: user.name,
      expense_type: expenseType,
      expense_detail: expenseDetail || null,
      expense_proof: expenseProof || null,
      expense_status: expenseStatus,
    };

    try {
      await axios.post(
        "https://expensetracker2-1.onrender.com/expenses",
        expenseData
      );
      toast.success("Expense added successfully!");
      setExpenseName("");
      setAmount("");
      setDate("");
      setSelectedProjectId("");
      setExpenseType("");
      setExpenseDetail("");
      setExpenseProof("");
      setExpenseStatus("");
      setFilteredExpenses((prev) => [...prev, expenseData]);
    } catch (err) {
      const errorMessage =
        "Failed to add expense. " + (err.response?.data?.detail || err.message);
      console.error("Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="min-h-screen grid grid-cols-10 grid-rows-10 gap-4 p-1">
      <div className="col-start-1 col-span-10 bg-white rounded-lg font-bold flex items-center pl-5">
        Welcome, {user.name}
      </div>

      {/* Add Expense Section */}
      <div className="col-start-1 col-span-4 row-start-2 row-span-9 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg flex flex-col">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Add Expense
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex-grow overflow-y-auto max-h-[75vh]"
          >
            {/* Member Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Member:
              </label>
              <input
                type="text"
                value={user.name || ""}
                disabled
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md bg-gray-100"
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
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
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
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter expense name"
              />
            </div>

            {/* Expense Type Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Expense Type:
              </label>
              <select
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                required
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              >
                <option value="">Select an expense type</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="hotel">Hotel</option>
                <option value="others">Others</option>
              </select>
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
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter amount"
              />
            </div>

            {/* Expense Detail Field (Optional) */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Expense Detail (Optional):
              </label>
              <input
                type="text"
                value={expenseDetail}
                onChange={(e) => setExpenseDetail(e.target.value)}
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter expense detail"
              />
            </div>

            {/* Expense Proof Field (Optional) */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Expense Proof (Optional):
              </label>
              <input
                type="text"
                value={expenseProof}
                onChange={(e) => setExpenseProof(e.target.value)}
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter proof URL"
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
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
              />
            </div>

            {/* Expense Status Field */}
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Expense Status:
              </label>
              <input
                type="text"
                value={expenseStatus}
                onChange={(e) => setExpenseStatus(e.target.value)}
                required
                className="ml-1 w-[95%] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                placeholder="Enter expense status"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="ml-1 w-[95%] bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              Add Expense
            </button>
          </form>
        </div>
      </div>

      {/* Total Expenses Section */}
      <div className="bg-white rounded col-start-5 col-span-6 row-start-2 row-span-9 p-4 flex-grow overflow-y-auto max-h-[75vh]">
        <div className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Expenses
        </div>
        <table className="w-full table-auto mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="border px-4 py-2">{expense.expense_date}</td>
                  <td className="border px-4 py-2">{expense.expense_name}</td>
                  <td className="border px-4 py-2">{expense.amount}</td>
                  <td className="border px-4 py-2">{expense.expense_type}</td>
                  <td className="border px-4 py-2">{expense.expense_status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No expenses found for the selected project.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-xl font-semibold text-right">
          Total Amount: {totalAmount}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
