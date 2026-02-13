import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskForm from "../../components/kanban/TaskForm";
import { taskService } from "../../services/taskService";

export default function TaskBoardPage() {
  const [columns, setColumns] = useState({
    "To Do": { title: "To Do", items: [] },
    "In Progress": { title: "In Progress", items: [] },
    "Done": { title: "Done", items: [] },
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);



  useEffect(() => {
    fetchTasks();
    // Get user role from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    setUserId(user._id);
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.allTasks();
      let tasks = response.data?.data || response.data ||[];

      // If logged user is DEVELOPER → only his tasks
      const isDeveloper = String(userRole || "").toUpperCase() === "DEVELOPER";

      if (isDeveloper) {
        tasks = tasks.filter((task) => {
          const assignedToId = task.assignedTo?._id || task.assignedTo;
          return String(assignedToId) === String(userId);
        });
      }
      console.log("Fetched tasks:", tasks); // Debug log

      const organizedTasks = {
        "To Do": { title: "To Do", items: [] },
        "In Progress": { title: "In Progress", items: [] },
        "Done": { title: "Done", items: [] },
      };

 tasks.forEach((task) => {
        const status = task.status || "To Do";
        if (!organizedTasks[status]) return;

        const assignedToObj = task.assignedTo || null;
        const assignedId = assignedToObj?._id || assignedToObj || "";

        const item = {
          id: task._id,
          content: task.title || "",
          assignedToId: assignedId,                    // ← most important fix
          developerName: assignedToObj?.firstName || assignedToObj?.name || "Unassigned",
          developerEmail: assignedToObj?.email || "",
          description: task.description || "",
          project: task.project?._id || null,
          projectName: task.project?.projectName || "No Project",
          startDate: task.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "",
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
          priority: task.priority || "MEDIUM",
          status: status,
          assignedByName: task.assignedBy?.firstName || task.assignedBy?.name || "",
        };

        organizedTasks[status].items.push(item);
      });

      setColumns(organizedTasks);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };


  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const isDeveloper = String(userRole || "").toUpperCase() === "DEVELOPER";

    if (isDeveloper) {
  const task = columns[source.droppableId].items.find(
    (item) => item.id === draggableId
  );

  if (!task || String(task.assignedToId) !== String(userId)) {
    console.log("Drag blocked - not own task", {
      draggableId,
      assignedTo: task?.assignedToId,
      userId,
      role: userRole
    });
    return;
  }
}

    const newStatus = destination.droppableId;

    // Optimistic update
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = source.droppableId === destination.droppableId 
      ? sourceItems 
      : [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);
    removed.status = newStatus;
    destItems.splice(destination.index, 0, removed);

    const newColumns = {
      ...columns,
      [source.droppableId]: { ...sourceColumn, items: sourceItems },
    };

    if (source.droppableId !== destination.droppableId) {
      newColumns[destination.droppableId] = { ...destColumn, items: destItems };
    }

    setColumns(newColumns);

    try {
      await taskService.updateStatus(draggableId, newStatus);
      fetchTasks(); // Refresh to ensure data is in sync with backend
    } catch (err) {
      console.error("Status update failed:", err);
      setError("Failed to update status");
      fetchTasks(); // rollback
    }
  };

  const addTask = async (taskData) => {
    try {
      const payload = {
        title: taskData.task,
        description: taskData.description || taskData.task,
        project: taskData.project || null,
        assignedTo: taskData.developer,
        startDate: taskData.startDate,
        dueDate: taskData.dueDate || taskData.startDate,
        priority: taskData.priority || "MEDIUM",
      };

      console.log("Creating task with payload:", payload);
      await taskService.create(payload);
      
      fetchTasks();
      setError(null);
      setShowForm(false);
    } catch (err) {
      console.error("Create task error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to create task";
      setError(errorMessage);
    }
  };

  const updateTaskDetails = async (updatedTask) => {
    try {
      const payload = {
        title: updatedTask.task,
        description: updatedTask.description || updatedTask.task,
        project: updatedTask.project || null,
        assignedTo: updatedTask.developer,
        startDate: updatedTask.startDate,
        dueDate: updatedTask.dueDate,
        priority: updatedTask.priority,
        status: updatedTask.status,
      };

      console.log("Updating task:", updatedTask.id, payload);
      await taskService.updateTask(updatedTask.id, payload);
      
      fetchTasks();
      setError(null);
      setShowForm(false);
      setEditTask(null);
    } catch (err) {
      console.error("Update task error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update task";
      setError(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      setSelectedTask(null);
      setError(null);
    } catch (err) {
      console.error("Delete task error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete task. You may not have permission.";
      setError(errorMessage);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTask(null);
  };

  const canEditOrDelete = userRole === 'TL' || userRole === 'ATL';
  

  if (loading) {
    return (
      <div style={{ 
        padding: "20px", 
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        color: "#666"
      }}>
        <div>
          <div style={{ marginBottom: "10px" }}>⏳</div>
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            border: "1px solid #ef5350",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "#c62828",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: "bold",
              padding: "0",
              marginLeft: "10px",
            }}
          >
            ×
          </button>
        </div>
      )}


      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>
          {canEditOrDelete ? "Kanban Board - All Tasks" : "My Tasks"}
        </h2>
        {canEditOrDelete && (
          <button
            onClick={() => {
              setEditTask(null);
              setShowForm(true);
            }}
            style={{
              backgroundColor: "#4169E1",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(65, 105, 225, 0.4)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
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
            + Assign Task
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
          }}
          onClick={handleCloseForm}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <TaskForm
              onAddTask={addTask}
              onUpdateTask={updateTaskDetails}
              onClose={handleCloseForm}
              editTask={editTask}
            />
          </div>
        </div>
      )}

      {selectedTask && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => setSelectedTask(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "500px",
              maxWidth: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#333" }}>{selectedTask.content}</h3>
            {selectedTask.description && (
              <p style={{ color: "#666", marginBottom: "20px" }}>{selectedTask.description}</p>
            )}
            
            <div style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>👤</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Assigned To:</span>
                <span style={{ color: "#333" }}>{selectedTask.developerName}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>✋</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Assigned By:</span>
                <span style={{ color: "#333" }}>{selectedTask.assignedByName}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>📁</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Project:</span>
                <span style={{ color: "#333" }}>{selectedTask.projectName}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>📅</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Timeline:</span>
                <span style={{ color: "#333" }}>{selectedTask.startDate} → {selectedTask.dueDate}</span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>⚡</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Priority:</span>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: selectedTask.priority === "HIGH" ? "#f44336" : 
                                  selectedTask.priority === "MEDIUM" ? "#ff9800" : "#4caf50",
                }}>
                  {selectedTask.priority}
                </span>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>📊</span>
                <span style={{ color: "#555", fontWeight: "500" }}>Status:</span>
                <span style={{
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "white",
                  backgroundColor: selectedTask.status === 'To Do' ? "#FF9800" : 
                                  selectedTask.status === 'In Progress' ? "#2196F3" : "#4CAF50",
                }}>
                  {selectedTask.status}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "25px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              {canEditOrDelete && (
                <>
                  <button
                    onClick={() => {
                      setEditTask(selectedTask);
                      setSelectedTask(null);
                      setShowForm(true);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 20px",
                      backgroundColor: "#4169E1",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#3a5fd0"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#4169E1"}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    style={{
                      flex: 1,
                      padding: "10px 20px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                style={{
                  flex: 1,
                  padding: "10px 20px",
                  backgroundColor: "#757575",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#616161"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "#757575"}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {Object.entries(columns).map(([id, column]) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: snapshot.isDraggingOver ? "#e3f2fd" : "#f4f5f7",
                    padding: "16px",
                    width: "360px",
                    minHeight: "400px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h4 style={{ margin: 0, color: "#333" }}>{column.title}</h4>
                    <span
                      style={{
                        background: "#ddd",
                        color: "#333",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {column.items.length}
                    </span>
                  </div>

                  {column.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={
                       String(userRole || "").toUpperCase() === "DEVELOPER" && String(item.assignedToId) !== String(userId)
  
                      }
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setSelectedTask(item)}
                          style={{
                            userSelect: "none",
                            padding: "12px",
                            margin: "0 0 8px 0",
                            background: String(item.assignedToId) === String(userId) && !canEditOrDelete ? "#fffbf0" : "white",
                            borderRadius: "6px",
                            boxShadow: snapshot.isDragging
                              ? "0 5px 15px rgba(0,0,0,0.2)"
                              : "0 1px 3px rgba(0,0,0,0.2)",
                            borderLeft: `4px solid ${
                              id === "To Do"
                                ? "#FF9800"
                                : id === "In Progress"
                                ? "#2196F3"
                                : "#4CAF50"
                            }`,
                            borderRight: String(item.assignedToId) === String(userId) && !canEditOrDelete ? "3px solid #4CAF50" : "none",
                            cursor: snapshot.isDragging ? "grabbing" : "grab",
                            transform: snapshot.isDragging
                              ? "rotate(2deg)"
                              : "none",
                            transition: "all 0.2s ease",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                fontSize: "14px",
                                color: "#333",
                                flex: 1,
                              }}
                            >
                              {item.content}
                            </div>
                            {canEditOrDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditTask({ ...item, status: id });
                                  setShowForm(true);
                                }}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  padding: "0 4px",
                                }}
                                title="Edit task"
                              >
                                ✏️
                              </button>
                            )}
                          </div>

                          {/* Show developer info for TL/ATL and all users to identify task assignment */}
                          {item.developerName && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: String(item.assignedToId) === String(userId) ? "#2e7d32" : "#666",
                                marginBottom: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: String(item.assignedToId) === String(userId) ? "#e8f5e9" : "#f5f5f5",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontWeight: String(item.assignedToId) === String(userId) ? "600" : "normal",
                              }}
                            >
                              👤 <strong>{item.developerName}</strong>
                              {item.developerEmail && (
                                <span style={{ color: String(item.assignedToId) === String(userId) ? "#1565c0" : "#999", fontSize: "11px" }}>
                                  ({item.developerEmail})
                                </span>
                              )}
                            </div>
                          )}

                          {/* Show "Your Task" badge for own tasks */}
                          {String(item.assignedToId) === String(userId) && !canEditOrDelete && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "white",
                                backgroundColor: "#4CAF50",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                display: "inline-block",
                                marginBottom: "4px",
                                fontWeight: "600",
                                marginRight: "4px",
                              }}
                            >
                              ✓ Your Task
                            </div>
                          )}

                          {/* Show assigned by info for TL/ATL */}
                          {canEditOrDelete && item.assignedByName && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#0066cc",
                                marginBottom: "6px",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: "#f0f7ff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              ✋ <strong>by {item.assignedByName}</strong>
                            </div>
                          )}

                          {item.projectName && item.projectName !== "No Project" && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#7b1fa2",
                                backgroundColor: "#f3e5f5",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                display: "inline-block",
                                marginBottom: "4px",
                              }}
                            >
                              📁 <strong>{item.projectName}</strong>
                            </div>
                          )}

                          {item.priority && (
                            <div
                              style={{
                                fontSize: "11px",
                                display: "flex",
                                color: "#fff",
                                backgroundColor:
                                  item.priority === "HIGH"
                                    ? "#f44336"
                                    : item.priority === "MEDIUM"
                                    ? "#ff9800"
                                    : "#4caf50",
                                padding: "2px 8px",
                                borderRadius: "10px",
                                marginRight: "4px",
                                marginTop: "4px",
                                width: "fit-content",
                              }}
                            >
                              {item.priority}
                            </div>
                          )}

                          {item.dueDate && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#888",
                                marginTop: "4px",
                                paddingTop: "4px",
                                borderTop: "1px solid #eee",
                              }}
                            >
                              📅 Due: {item.dueDate}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}