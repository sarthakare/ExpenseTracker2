import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Members() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectAdminId, setProjectAdminId] = useState("");
  const [projectAdminName, setProjectAdminName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [assignedMembers, setAssignedMembers] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("email");

    // Fetch the user ID based on the admin email
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(
          `https://expensetracker2-1.onrender.com/users/email/${email}`
        );
        const userId = response.data.id; 
        setProjectAdminId(userId); // Set the admin ID
        const userName = response.data.name; 
        setProjectAdminName(userName); // Set the admin name
      } catch (error) {
        toast.error("Failed to fetch admin ID. " + error);
      }
    };

    if (email) {
      fetchAdminId();
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker2-1.onrender.com/projects"
        );
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects.");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://expensetracker2-1.onrender.com/users"
        );
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchProjects();
    fetchUsers();
  }, []);

  // Fetch members assigned to the selected project
  useEffect(() => {
    const fetchAssignedMembers = async () => {
      if (selectedProjectId) {
        try {
          const response = await axios.get(
            `https://expensetracker2-1.onrender.com/projects/${selectedProjectId}/members`
          );
          setAssignedMembers(response.data); 
        } catch (error) {
          toast.error("None assigned members. " + error);
        }
      } else {
        setAssignedMembers([]);
      }
    };

    fetchAssignedMembers();
  }, [selectedProjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://expensetracker2-1.onrender.com/members", {
        project_id: selectedProjectId,
        member_id: selectedMemberId,
      });
      toast.success("Member added successfully!");
      setSelectedProjectId("");
      setSelectedMemberId("");
      // Fetch the updated list of assigned members after adding a new member
      const response = await axios.get(
        `https://expensetracker2-1.onrender.com/projects/${selectedProjectId}/members`
      );
      setAssignedMembers(response.data);
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member.");
    }
  };

  // Filter the projects to only include the ones with the matching admin_id
  const filteredProjects = projects.filter(
    (project) => project.project_admin_id === projectAdminId
  );

  // Filter the members to exclude the current admin and already assigned members
  const filteredMembers = members.filter(
    (member) =>
      member.id !== projectAdminId &&
      !assignedMembers.some((m) => m.member_id === member.id)
  );

  return (
    <div>
      <h2>Add Members to Project</h2>
      <div>
        <label>Project Admin ID:</label>
        <input type="number" value={projectAdminId} disabled />
      </div>
      <div>
        <label>Project Admin Name:</label>
        <input type="text" value={projectAdminName} disabled />
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            required
          >
            <option value="">Select a project</option>
            {filteredProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Assign Member:</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            required
          >
            <option value="">Select a member</option>
            {filteredMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}{" "}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Member</button>
      </form>

      <h3>Assigned Members</h3>
      {assignedMembers.length > 0 ? (
        <ul>
          {assignedMembers.map((member) => (
            <li key={member.member_id}>
              {member.member_id}{" "}
              {/* Change this to display member name if needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No members assigned yet.</p>
      )}
    </div>
  );
}

export default Members;
