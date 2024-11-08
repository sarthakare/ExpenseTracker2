import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Projects() {
  const [projectName, setProjectName] = useState("");
  const [projectAdminId, setProjectAdminId] = useState("");
  const [projectAdminName, setProjectAdminName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userProjects, setUserProjects] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [status, setStatus] = useState("Pending Approval");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");

    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        const userId = response.data.id;
        setProjectAdminId(userId);
        const userName = response.data.name;
        setProjectAdminName(userName);

        fetchAllProjects(userId);
        fetchExpenses();
      } catch (error) {
        toast.error("Failed to fetch admin ID. " + error);
      }
    };

    if (email) {
      fetchAdminId();
    }
  }, []);

  const fetchAllProjects = async (userId) => {
    try {
      const response = await axios.get(
        "https://expensetracker2-1.onrender.com/projects/"
      );
      const filteredProjects = response.data.filter(
        (project) => project.project_admin_id === userId
      );
      setUserProjects(filteredProjects);
    } catch (error) {
      toast.error("Failed to fetch projects. " + error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "https://expensetracker2-1.onrender.com/expenses"
      );
      setExpensesData(response.data);
    } catch (error) {
      toast.error("Failed to fetch expenses. " + error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      project_name: projectName,
      project_admin_id: projectAdminId,
      project_admin_name: projectAdminName,
      start_date: startDate,
      end_date: endDate || null,
    };

    try {
      const projectResponse = await axios.post(
        "https://expensetracker2-1.onrender.com/projects",
        projectData
      );
      toast.success("Project created successfully");

      const memberData = {
        project_id: projectResponse.data.id,
        member_id: projectAdminId,
        member_role: "admin",
        project_name: projectName,
        member_name: projectAdminName,
      };

      await axios.post(
        "https://expensetracker2-1.onrender.com/members",
        memberData
      );
      toast.success("Admin added as a member successfully!");

      fetchAllProjects(projectAdminId);
      setProjectName("");
      setStartDate("");
      setEndDate("");
      navigate("/home/members");
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.detail + " Project creation failed!");
      } else {
        toast.error("Project creation failed! Please try again.");
      }
    }
  };

  // Calculate total expenses per project
  const projectExpenses = userProjects.map((project) => {
    const totalExpense = expensesData
      .filter((expense) => expense.project_id === project.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return { project_name: project.project_name, total_expense: totalExpense };
  });

  // Function to handle opening the expense details in a popup
  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setStatus(expense.expense_status || "Pending Approval");
    setIsModalOpen(true);
  };

  // Function to handle status change in the dropdown
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Function to handle saving the updated status and reloading the expenses table
  const handleSaveStatus = async () => {
    try {
      await axios.put(
        `https://expensetracker2-1.onrender.com/expenses/${selectedExpense.id}`,
        { expense_status: status }
      );
      toast.success("Status updated successfully!");
      setIsModalOpen(false);
      fetchExpenses(); // Reloads the expenses table after status update
    } catch (error) {
      toast.error("Failed to update status. " + error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Rejected":
        return "text-red-600";
      case "Paid":
        return "text-green-600";
      case "Pending Approval":
        return "text-yellow-600";
      case "Approved":
        return "text-blue-600";
      case "Under Review":
        return "text-orange-600";
      case "Partially Paid":
        return "text-teal-600";
      case "On Hold":
        return "text-gray-500";
      case "Submitted for Reimbursement":
        return "text-purple-600";
      case "Canceled":
        return "text-gray-400";
      case "Reimbursed":
        return "text-green-500";
      default:
        return "text-black";
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-10 grid-rows-10 gap-4 p-1">
      <div className="col-start-1 col-span-10 bg-white rounded-lg font-bold flex items-center pl-5">
        <h3 className="">Welcome {projectAdminName},</h3>
      </div>
      <div className="sm:col-start-1 sm:col-span-4 sm:row-start-2 sm:row-span-9 col-start-1 col-span-10 row-start-2 row-span-5">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Create New Project
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Name:
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                placeholder="Enter project name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Admin ID:
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                value={projectAdminId}
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Project Admin Name:
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                value={projectAdminName}
                disabled
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Start Date:
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                End Date:
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-500 ease-in-out"
            >
              Create Project
            </button>
          </form>
        </div>
      </div>

      {/* Total Projects Section */}
      <div className="sm:col-start-5 sm:col-span-3 sm:row-start-2 sm:row-span-4 col-start-1 col-span-10 row-start-7 row-span-2  bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Projects
        </h3>

        <div className="overflow-y-auto max-h-40">
          {userProjects.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-purple-300">
                {/* Set background color for header */}
                <tr>
                  <th className="px-1 py-2 border">Project Name</th>
                  <th className="px-1 py-2 border">Start Date</th>
                  <th className="px-1 py-2 border">End Date</th>
                </tr>
              </thead>

              <tbody>
                {userProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="px-1 py-2 border">{project.project_name}</td>
                    <td className="px-1 py-2 border">{project.start_date}</td>
                    <td className="px-1 py-2 border">
                      {project.end_date ? project.end_date : "Ongoing"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No projects created yet.</p>
          )}
        </div>
      </div>

      {/* Total Expenses Section */}
      <div className="sm:col-start-8 sm:col-span-3 sm:row-start-2 sm:row-span-4 col-start-1 col-span-10 row-start-9 row-span-2 bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Expenses
        </h3>

        <div className="overflow-y-auto max-h-40">
          {projectExpenses.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-purple-300">
                {/* Set background color for header */}
                <tr>
                  <th className="px-4 py-2 border">Project Name</th>
                  <th className="px-4 py-2 border">Total Expense</th>
                </tr>
              </thead>

              <tbody>
                {projectExpenses.map((project) => (
                  <tr
                    key={project.project_name}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="border px-4 py-2">{project.project_name}</td>
                    <td className="border px-4 py-2">
                      {project.total_expense}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No expenses data found.</p>
          )}
        </div>
      </div>

      {/* Total Transactions Section */}
      <div className="sm:col-start-5 sm:col-span-6 sm:row-start-6 sm:row-span-5 col-start-1 col-span-10 row-start-11  bg-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Total Transactions
        </h3>
        <div className="overflow-y-auto max-h-64">
          {expensesData.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-purple-300">
                <tr>
                  <th className="px-4 py-2 border">Project Name</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {expensesData.map((expense) => (
                  <tr
                    key={expense.id}
                    className="text-center hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">{expense.project_name}</td>
                    <td className="border px-4 py-2">{expense.expense_date}</td>
                    <td className="border px-4 py-2">{expense.expense_name}</td>
                    <td className="border px-4 py-2">{expense.amount}</td>
                    <td className="border px-4 py-2">{expense.expense_type}</td>
                    <td
                      className={`border px-4 py-2 hover:cursor-pointer ${getStatusColor(
                        expense.expense_status
                      )}`}
                      onClick={() => handleExpenseClick(expense)}
                    >
                      {expense.expense_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center">No transactions found.</p>
          )}
        </div>
      </div>

      {/* Modal for expense details */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-1/3">
            <h3 className="text-xl font-bold mb-2">Expense Details</h3>
            <p>
              <strong>Project Name:</strong> {selectedExpense.project_name}
            </p>
            <p>
              <strong>Amount:</strong> {selectedExpense.amount}
            </p>
            <p>
              <strong>Date:</strong> {selectedExpense.expense_date}
            </p>
            <p>
              <strong>Type:</strong> {selectedExpense.expense_type}
            </p>
            <label className="block mt-4">
              <strong>Status:</strong>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full border border-gray-300 p-2 rounded-md mt-2"
              >
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Under Review">Under Review</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="On Hold">On Hold</option>
                <option value="Submitted for Reimbursement">
                  Submitted for Reimbursement
                </option>
                <option value="Canceled">Canceled</option>
                <option value="Reimbursed">Reimbursed</option>
              </select>
            </label>
            <button
              onClick={handleSaveStatus}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 text-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
