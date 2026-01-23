import { useState, useEffect } from "react";
import { taskService } from "../../services/taskService.js";

export default function TaskForm({ onAddTask, onClose, onUpdateTask, editTask }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [formError, setFormError] = useState("");

  const getInitialFormData = () => {
    if (editTask) {
      return {
        developer: editTask.developer || "",
        task: editTask.content || "",
        description: editTask.description || "",
        project: editTask.projectName || "",
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
      startDate: "",
      dueDate: "",
      status: "To Do",
      priority: "MEDIUM",
    };
  };

  const [formData, setFormData] = useState(() => getInitialFormData());

  useEffect(() => {
    fetchUsers();
    fetchProjects();
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
const fetchProjects = async () => {
  try {
    setLoadingProjects(true);
    const response = await taskService.getAllProjects();

    
    console.log("Projects API full response:", response);
    console.log("response.data:", response.data);
    console.log("Is response.data array?", Array.isArray(response.data));

    
    const projectsData = Array.isArray(response.data) 
      ? response.data 
      : (response.data?.data && Array.isArray(response.data.data) 
          ? response.data.data 
          : []);

    setProjects(projectsData);
    console.log("Projects set to state:", projectsData);
  } catch (error) {
    console.error("Error fetching projects:", error);
    setProjects([]); 
  } finally {
    setLoadingProjects(false);
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
    setFormError("");
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "32px",
      width: "90%",
      maxWidth: "650px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 24px 48px rgba(0, 0, 0, 0.15)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        paddingBottom: "16px",
        borderBottom: "2px solid #f0f0f0",
      }}>
        <div>
          <h2 style={{ margin: 0, color: "#1a1a1a", fontSize: "26px", fontWeight: "700" }}>
            {editTask ? "Edit Task" : "Assign New Task"}
          </h2>
          <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>
            {editTask ? "Update task details below" : "Fill in the details to assign a new task"}
          </p>
        </div>
        <button 
          onClick={onClose}
          type="button"
          style={{
            backgroundColor: "transparent",
            border: "none",
            fontSize: "32px",
            cursor: "pointer",
            color: "#999",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            lineHeight: "1",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f5f5f5";
            e.target.style.color = "#333";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#999";
          }}
        >
          ×
        </button>
      </div>

      {/* Error Message */}
      {formError && (
        <div style={{
          backgroundColor: "#fff3f3",
          color: "#d32f2f",
          padding: "14px 16px",
          borderRadius: "10px",
          marginBottom: "24px",
          fontSize: "14px",
          border: "1px solid #ffcdd2",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "18px" }}>⚠️</span>
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Developer Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Assign To<span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
          </label>
          <select
            name="developer"
            value={formData.developer}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #e8e8e8",
              borderRadius: "10px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              backgroundColor: "white",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
              e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e8e8e8";
              e.target.style.boxShadow = "none";
            }}
            disabled={loadingUsers}
            required
          >
            <option value="">
              {loadingUsers ? "Loading developers..." : "Select a developer"}
            </option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Task Title Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Task Title<span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="e.g., Implement user authentication"
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #e8e8e8",
              borderRadius: "10px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
              e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e8e8e8";
              e.target.style.boxShadow = "none";
            }}
            required
          />
        </div>

        {/* Description Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Description
            <span style={{ color: "#999", fontWeight: "400", marginLeft: "6px", fontSize: "13px" }}>
              (Optional)
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide additional details about the task..."
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #e8e8e8",
              borderRadius: "10px",
              fontSize: "14px",
              minHeight: "100px",
              resize: "vertical",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              fontFamily: "inherit",
              lineHeight: "1.5",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
              e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e8e8e8";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Project Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Project
            <span style={{ color: "#999", fontWeight: "400", marginLeft: "6px", fontSize: "13px" }}>
            </span>
          </label>
          <select
            name="project"
            value={formData.project}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "2px solid #e8e8e8",
              borderRadius: "10px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              boxSizing: "border-box",
              backgroundColor: "white",
              cursor: "pointer",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#4169E1";
              e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e8e8e8";
              e.target.style.boxShadow = "none";
            }}
            disabled={loadingProjects}
          >
            <option value="">
              {loadingProjects ? "Loading projects..." : "No project "}
            </option>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project) => (
                <option key={project._id} value={project._id}>
                  📁 {project.projectName || "Unnamed Project"}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {loadingProjects ? "Loading..." : "No projects available"}
              </option>
            )}
          </select>
          {projects.length === 0 && !loadingProjects && (
            <p style={{ 
              margin: "8px 0 0 0", 
              color: "#999", 
              fontSize: "12px",
              fontStyle: "italic" 
            }}>
              No projects available
            </p>
          )}
        </div>

        {/* Date Fields */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "24px",
        }}>
          <div>
            <label style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
              color: "#333",
              fontSize: "15px",
            }}>
              Start Date<span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e8e8e8",
                borderRadius: "10px",
                fontSize: "14px",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#4169E1";
                e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e8e8e8";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          
          <div>
            <label style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "600",
              color: "#333",
              fontSize: "15px",
            }}>
              Due Date<span style={{ color: "#f44336", marginLeft: "4px" }}>*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={formData.startDate}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e8e8e8",
                borderRadius: "10px",
                fontSize: "14px",
                transition: "all 0.2s ease",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#4169E1";
                e.target.style.boxShadow = "0 0 0 3px rgba(65, 105, 225, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e8e8e8";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
        </div>

        {/* Priority Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Priority Level
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
              <label 
                key={priority}
                style={{
                  flex: "1",
                  minWidth: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: `2px solid ${
                    formData.priority === priority 
                      ? (priority === 'HIGH' ? '#f44336' : priority === 'MEDIUM' ? '#ff9800' : '#4caf50')
                      : '#e8e8e8'
                  }`,
                  backgroundColor: formData.priority === priority 
                    ? (priority === 'HIGH' ? '#fff5f5' : priority === 'MEDIUM' ? '#fff8f0' : '#f1f8f4')
                    : 'white',
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (formData.priority !== priority) {
                    e.currentTarget.style.borderColor = '#d0d0d0';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.priority !== priority) {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={handleChange}
                  style={{ 
                    marginRight: "8px",
                    cursor: "pointer",
                    width: "16px",
                    height: "16px",
                  }}
                />
                <span style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: formData.priority === priority
                    ? (priority === 'HIGH' ? '#f44336' : priority === 'MEDIUM' ? '#ff9800' : '#4caf50')
                    : '#666',
                }}>
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Field */}
        <div style={{ marginBottom: "32px" }}>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontWeight: "600",
            color: "#333",
            fontSize: "15px",
          }}>
            Task Status
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <label 
                key={status}
                style={{
                  flex: "1",
                  minWidth: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: `2px solid ${
                    formData.status === status 
                      ? (status === 'To Do' ? '#FF9800' : status === 'In Progress' ? '#2196F3' : '#4CAF50')
                      : '#e8e8e8'
                  }`,
                  backgroundColor: formData.status === status 
                    ? (status === 'To Do' ? '#fff8f0' : status === 'In Progress' ? '#f0f7ff' : '#f1f8f4')
                    : 'white',
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (formData.status !== status) {
                    e.currentTarget.style.borderColor = '#d0d0d0';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.status !== status) {
                    e.currentTarget.style.borderColor = '#e8e8e8';
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleChange}
                  style={{ 
                    marginRight: "8px",
                    cursor: "pointer",
                    width: "16px",
                    height: "16px",
                  }}
                />
                <span style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: formData.status === status
                    ? (status === 'To Do' ? '#FF9800' : status === 'In Progress' ? '#2196F3' : '#4CAF50')
                    : '#666',
                }}>
                  {status}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          paddingTop: "24px",
          borderTop: "2px solid #f0f0f0",
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "14px 28px",
              backgroundColor: "white",
              border: "2px solid #e8e8e8",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              color: "#666",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f5f5f5";
              e.target.style.borderColor = "#d0d0d0";
              e.target.style.color = "#333";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.borderColor = "#e8e8e8";
              e.target.style.color = "#666";
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loadingUsers || loadingProjects}
            style={{
              padding: "14px 32px",
              backgroundColor: (loadingUsers || loadingProjects) ? "#ccc" : "#4169E1",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: (loadingUsers || loadingProjects) ? "not-allowed" : "pointer",
              color: "white",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(65, 105, 225, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loadingUsers && !loadingProjects) {
                e.target.style.backgroundColor = "#3a5fd0";
                e.target.style.boxShadow = "0 6px 16px rgba(65, 105, 225, 0.4)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loadingUsers && !loadingProjects) {
                e.target.style.backgroundColor = "#4169E1";
                e.target.style.boxShadow = "0 4px 12px rgba(65, 105, 225, 0.3)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {editTask ? "💾 Update Task" : "✓ Assign Task"}
          </button>
        </div>
      </form>
    </div>
  );
}