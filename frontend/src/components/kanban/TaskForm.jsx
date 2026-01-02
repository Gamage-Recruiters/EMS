import React from "react"; 
import { useState } from "react";

export default function TaskForm({ onAddTask, onClose }) {
  const [formData, setFormData] = useState({
    developer: "",
    task: "",
    project: "",
    startDate: "",
    dueDate: "",
    status: "todo",
  });

  const developers = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"];
  const projects = ["Website", "Mobile App", "API", "Admin Panel"];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.task.trim()) {
      alert("Please enter a task description");
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      content: formData.task,
      developer: formData.developer,
      project: formData.project,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
    };

    onAddTask(formData.status, newTask);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "30px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
        animation: "slideUp 0.3s ease",
      }}>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideUp {
              from { transform: translateY(30px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}
        </style>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          paddingBottom: "15px",
          borderBottom: "2px solid #f0f0f0",
        }}>
          <h2 style={{ margin: 0, color: "#333", fontSize: "24px" }}>
            Assign New Task
          </h2>
          <button 
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#555",
              fontSize: "14px",
            }}>
              Developer:
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
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#4169E1";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
              }}
              required
            >
              <option value="">Select Developer</option>
              {developers.map((dev, index) => (
                <option key={index} value={dev}>{dev}</option>
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
              Task Description:
            </label>
            <textarea
              name="task"
              value={formData.task}
              onChange={handleChange}
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
              Project:
            </label>
            <select
              name="project"
              value={formData.project}
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
            >
              <option value="">Select Project</option>
              {projects.map((proj, index) => (
                <option key={index} value={proj}>{proj}</option>
              ))}
            </select>
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
                Start Date:
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
                Due Date:
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
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
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#555",
              fontSize: "14px",
            }}>
              Status:
            </label>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              {['todo', 'inprogress', 'done'].map((status) => (
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
                    backgroundColor: status === 'todo' ? "#FF9800" : 
                                    status === 'inprogress' ? "#2196F3" : "#4CAF50",
                  }}>
                    {status === 'todo' ? 'To Do' : 
                     status === 'inprogress' ? 'In Progress' : 'Done'}
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
              style={{
                padding: "12px 24px",
                backgroundColor: "#4169E1",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                color: "white",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(65, 105, 225, 0.4)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(65, 105, 225, 0.6)";
                e.target.style.backgroundColor = "#3a5fd0";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(65, 105, 225, 0.4)";
                e.target.style.backgroundColor = "#4169E1";
              }}
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}