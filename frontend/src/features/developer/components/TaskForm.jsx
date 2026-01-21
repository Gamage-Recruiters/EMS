import { useState, useEffect } from "react";
import { taskService } from "../../../services/taskService";

export default function TaskForm({ onAddTask, onClose, onUpdateTask, editTask }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formError, setFormError] = useState("");

  const getInitialFormData = () => {
    if (editTask) {
      return {
        developer: editTask.developer || "",
        task: editTask.content || "",
        description: editTask.description || "",
        project: editTask.project || "",
        projectName: editTask.projectName || "",
        startDate: editTask.startDate || "",
        dueDate: editTask.dueDate || "",
        status: editTask.status || "To Do",
        priority: editTask.priority || "MEDIUM",
      };
    }
    return {
      developer: "",
      task: "",
      description: "",
      project: "",
      projectName: "",
      startDate: "",
      dueDate: "",
      status: "To Do",
      priority: "MEDIUM",
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData());

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFormData(getInitialFormData());
    setFormError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await taskService.getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setFormError("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateForm = () => {
    if (!formData.task.trim()) {
      setFormError("Task title is required");
      return false;
    }

    if (!formData.developer) {
      setFormError("Please select a developer");
      return false;
    }

    if (!formData.startDate) {
      setFormError("Start date is required");
      return false;
    }

    if (!formData.dueDate) {
      setFormError("Due date is required");
      return false;
    }

    if (new Date(formData.dueDate) < new Date(formData.startDate)) {
      setFormError("Due date cannot be before start date");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    const submitData = {
      id: editTask?.id,
      developer: formData.developer,
      task: formData.task,
      description: formData.description || formData.task,
      project: formData.project || null,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: formData.status,
      priority: formData.priority,
    };

    if (editTask) {
      onUpdateTask(submitData);
    } else {
      onAddTask(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormError(""); // Clear error when user types
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "30px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        paddingBottom: "15px",
        borderBottom: "2px solid #f0f0f0",
      }}>
        <h2 style={{ margin: 0, color: "#333", fontSize: "24px" }}>
          {editTask ? "Edit Task" : "Assign New Task"}
        </h2>
        <button 
          onClick={onClose}
          type="button"
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: "#666",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f0f0f0";
            e.target.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#666";
          }}
        >
          ×
        </button>
      </div>

      {formError && (
        <div style={{
          backgroundColor: "#ffebee",
          color: "#c62828",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
          border: "1px solid #ef5350",
        }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Developer<span style={{ color: "#f44336" }}>*</span>
          </label>
          <select
            name="developer"
            value={formData.developer}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              transition: "border-color 0.3s ease",
              boxSizing: "border-box",
              backgroundColor: "white",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
            }}
            disabled={loadingUsers}
            required
          >
            <option value="">
              {loadingUsers ? "Loading developers..." : "Select a developer"}
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Task Title<span style={{ color: "#f44336" }}>*</span>
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="Enter task title..."
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              transition: "border-color 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)..."
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              minHeight: "80px",
              resize: "vertical",
              transition: "border-color 0.3s ease",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Project ID (Optional)
          </label>
          <input
            type="text"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Enter project ID (leave empty if no project)"
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "14px",
              transition: "border-color 0.3s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
            }}
          />
          <small style={{ color: "#888", fontSize: "12px", marginTop: "4px", display: "block" }}>
            Tip: You can leave this empty if the task is not associated with a project
          </small>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#555",
              fontSize: "14px",
            }}>
              Start Date<span style={{ color: "#f44336" }}>*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#4169E1";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
              }}
              required
            />
          </div>
          
          <div>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#555",
              fontSize: "14px",
            }}>
              Due Date<span style={{ color: "#f44336" }}>*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={formData.startDate}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                transition: "border-color 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#4169E1";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
              }}
              required
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Priority
          </label>
          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
              <label 
                key={priority}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={handleChange}
                  style={{ marginRight: "8px" }}
                />
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: priority === 'HIGH' ? "#f44336" : 
                                  priority === 'MEDIUM' ? "#ff9800" : "#4caf50",
                }}>
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "600",
            color: "#555",
            fontSize: "14px",
          }}>
            Status
          </label>
          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <label 
                key={status}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleChange}
                  style={{ marginRight: "8px" }}
                />
                <span style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: status === 'To Do' ? "#FF9800" : 
                                  status === 'In Progress' ? "#2196F3" : "#4CAF50",
                }}>
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "15px",
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "2px solid #f0f0f0",
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "12px 24px",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              color: "#666",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e0e0e0";
              e.target.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f0f0f0";
              e.target.style.color = "#666";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loadingUsers}
            style={{
              padding: "12px 24px",
              backgroundColor: loadingUsers ? "#ccc" : "#4169E1",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loadingUsers ? "not-allowed" : "pointer",
              color: "white",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(65, 105, 225, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loadingUsers) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(65, 105, 225, 0.6)";
                e.target.style.backgroundColor = "#3a5fd0";
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingUsers) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(65, 105, 225, 0.4)";
                e.target.style.backgroundColor = "#4169E1";
              }
            }}
          >
            {editTask ? "Update Task" : "Assign Task"}
          </button>
        </div>
      </form>
    </div>
  );
}