import { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskForm from "./TaskForm";
import { taskService } from "../../services/taskService";

const STATUSES = ["To Do", "In Progress", "Done"];

export default function TaskBoardPage() {
  const [allTasks, setAllTasks] = useState([]);
  const [columns, setColumns] = useState({
    "To Do": { title: "To Do", items: [] },
    "In Progress": { title: "In Progress", items: [] },
    Done: { title: "Done", items: [] },
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [showOnlyExpired, setShowOnlyExpired] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("ALL");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user?.role || "");
    setUserId(user?._id || "");
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchTasks();
  }, [userId]);

  const roleUpper = String(userRole).toUpperCase();
  const isDeveloper = roleUpper === "DEVELOPER";
  const canCreateTask = ["TL", "ATL", "PM"].includes(roleUpper);
  const canEditOrDelete = ["TL", "ATL"].includes(roleUpper);
  const canDragAnyTask = ["TL", "ATL", "PM"].includes(roleUpper);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.allTasks();
      const tasks = response.data?.data || [];
      setAllTasks(tasks);
      setError("");
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const normalizedTasks = useMemo(() => {
    return allTasks.map((task) => {
      const assignedToObj = task.assignedTo || null;
      const assignedId = assignedToObj?._id || assignedToObj || "";

      return {
        id: task._id,
        content: task.title || "",
        description: task.description || "",
        status: task.status || "To Do",
        priority: task.priority || "MEDIUM",

        assignedToId: assignedId,
        developerId: assignedId,
        developerName:
          `${assignedToObj?.firstName || ""} ${assignedToObj?.lastName || ""}`.trim() ||
          assignedToObj?.name ||
          "Unassigned",
        developerEmail: assignedToObj?.email || "",

        assignedById: task.assignedBy?._id || "",
        assignedByName:
          `${task.assignedBy?.firstName || ""} ${task.assignedBy?.lastName || ""}`.trim() ||
          task.assignedBy?.name ||
          "",

        project: task.project?._id || "",
        projectName: task.project?.projectName || "No Project",

        startDate: task.startDate
          ? new Date(task.startDate).toISOString().split("T")[0]
          : "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      };
    });
  }, [allTasks]);

  const projectOptions = useMemo(() => {
    const map = new Map();

    normalizedTasks.forEach((task) => {
      if (
        task.project &&
        task.projectName &&
        task.projectName !== "No Project"
      ) {
        map.set(task.project, {
          id: task.project,
          name: task.projectName,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [normalizedTasks]);

  const isTaskExpired = (task) => {
    if (!task.dueDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    return due < today && task.status !== "Done";
  };

  const getDaysLate = (dueDate) => {
    if (!dueDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diff = today - due;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const filteredTasks = useMemo(() => {
    let result = [...normalizedTasks];
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((task) => {
        return (
          task.content.toLowerCase().includes(term) ||
          task.developerName.toLowerCase().includes(term) ||
          task.developerEmail.toLowerCase().includes(term) ||
          task.projectName.toLowerCase().includes(term)
        );
      });
    }

    if (showOnlyMyTasks) {
      result = result.filter(
        (task) => String(task.assignedToId) === String(userId),
      );
    }

    if (selectedStatusFilter !== "ALL") {
      result = result.filter((task) => task.status === selectedStatusFilter);
    }

    if (showOnlyExpired) {
      result = result.filter((task) => isTaskExpired(task));
    }

    if (selectedProjectFilter !== "ALL") {
      if (selectedProjectFilter === "NO_PROJECT") {
        result = result.filter((task) => !task.project);
      } else {
        result = result.filter(
          (task) => String(task.project) === String(selectedProjectFilter),
        );
      }
    }

    return result;
  }, [
    normalizedTasks,
    searchTerm,
    showOnlyMyTasks,
    selectedStatusFilter,
    showOnlyExpired,
    selectedProjectFilter,
    userId,
  ]);

  useEffect(() => {
    const organizedTasks = {
      "To Do": { title: "To Do", items: [] },
      "In Progress": { title: "In Progress", items: [] },
      Done: { title: "Done", items: [] },
    };

    filteredTasks.forEach((task) => {
      if (organizedTasks[task.status]) {
        organizedTasks[task.status].items.push(task);
      }
    });

    setColumns(organizedTasks);
  }, [filteredTasks]);

  const canDragTask = (task) => {
    if (canDragAnyTask) return true;
    if (isDeveloper) {
      return String(task.assignedToId) === String(userId);
    }
    return false;
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns[source.droppableId];
    const movedTask = sourceColumn.items.find(
      (item) => item.id === draggableId,
    );

    if (!movedTask) return;

    if (!canDragTask(movedTask)) {
      setError("You can only move tasks assigned to you.");
      return;
    }

    const newStatus = destination.droppableId;

    const newColumns = JSON.parse(JSON.stringify(columns));
    const sourceItems = [...newColumns[source.droppableId].items];
    const destinationItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : [...newColumns[destination.droppableId].items];

    const [removed] = sourceItems.splice(source.index, 1);
    removed.status = newStatus;
    destinationItems.splice(destination.index, 0, removed);

    newColumns[source.droppableId].items = sourceItems;
    newColumns[destination.droppableId].items = destinationItems;

    setColumns(newColumns);

    try {
      await taskService.updateStatus(draggableId, newStatus);
      await fetchTasks();
      setError("");
    } catch (err) {
      console.error("Status update failed:", err);
      setError(err.response?.data?.message || "Failed to update task status");
      await fetchTasks();
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
        status: taskData.status || "To Do",
      };

      await taskService.create(payload);
      await fetchTasks();
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("Create task error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create task",
      );
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

      await taskService.updateTask(updatedTask.id, payload);
      await fetchTasks();
      setShowForm(false);
      setEditTask(null);
      setError("");
    } catch (err) {
      console.error("Update task error:", err);
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(taskId);
      await fetchTasks();
      setSelectedTask(null);
      setError("");
    } catch (err) {
      console.error("Delete task error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete task. You may not have permission.",
      );
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTask(null);
  };

  const getColumnColor = (id) => {
    if (id === "To Do") return "#FF9800";
    if (id === "In Progress") return "#2196F3";
    return "#4CAF50";
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: "18px",
          color: "#666",
          background: "#f6f8fc",
        }}
      >
        Loading tasks...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f8fc",
        padding: "24px",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "18px",
          padding: "20px 24px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ margin: 0, color: "#1e293b" }}>
              {isDeveloper ? "Task Board" : "Kanban Board - Team Tasks"}
            </h2>
            <p
              style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}
            >
              {isDeveloper
                ? "View all tasks or switch to your own tasks only."
                : "Manage, search, and track project tasks easily."}
            </p>
          </div>

          {canCreateTask && (
            <button
              onClick={() => {
                setEditTask(null);
                setShowForm(true);
              }}
              style={{
                background: "linear-gradient(135deg, #4169E1, #5b7cff)",
                color: "#fff",
                border: "none",
                padding: "12px 20px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 24px rgba(65, 105, 225, 0.25)",
              }}
            >
              + Assign Task
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: "14px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "#eef2ff",
              color: "#3730a3",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            Total Tasks: {normalizedTasks.length}
          </span>

          <span
            style={{
              background: "#fff1f2",
              color: "#be123c",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "700",
            }}
          >
            Expired:{" "}
            {normalizedTasks.filter((task) => isTaskExpired(task)).length}
          </span>
        </div>

        <div
          style={{
            marginTop: "18px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: "12px",
          }}
        >
          <input
            type="text"
            placeholder={
              isDeveloper
                ? "Search by task name, project, developer..."
                : "Search by task name or developer name..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #dbe2ea",
              fontSize: "14px",
              outline: "none",
            }}
          />

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #dbe2ea",
              fontSize: "14px",
              background: "#fff",
            }}
          >
            <option value="ALL">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #dbe2ea",
              fontSize: "14px",
              background: "#fff",
            }}
          >
            <option value="ALL">All Projects</option>
            <option value="NO_PROJECT">No Project</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#f8fafc",
              border: "1px solid #dbe2ea",
              borderRadius: "12px",
              padding: "0 14px",
              fontSize: "14px",
              color: "#334155",
              minHeight: "46px",
            }}
          >
            <input
              type="checkbox"
              checked={showOnlyMyTasks}
              onChange={(e) => setShowOnlyMyTasks(e.target.checked)}
            />
            My Tasks Only
          </label>

          {!isDeveloper ? (
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "12px",
                padding: "0 14px",
                fontSize: "14px",
                color: "#9f1239",
                minHeight: "46px",
                fontWeight: "600",
              }}
            >
              <input
                type="checkbox"
                checked={showOnlyExpired}
                onChange={(e) => setShowOnlyExpired(e.target.checked)}
              />
              Expired Tasks Only
            </label>
          ) : (
            <div />
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "18px",
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <div
          onClick={handleCloseForm}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 3000,
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
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
          onClick={() => setSelectedTask(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2500,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "540px",
              maxWidth: "92%",
              background: "#fff",
              borderRadius: "18px",
              padding: "28px",
              boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#0f172a" }}>
              {selectedTask.content}
            </h3>
            <p style={{ color: "#64748b", lineHeight: 1.6 }}>
              {selectedTask.description || "No description provided."}
            </p>

            <div style={{ display: "grid", gap: "10px", marginTop: "20px" }}>
              <InfoRow label="Assigned To" value={selectedTask.developerName} />
              <InfoRow
                label="Assigned By"
                value={selectedTask.assignedByName || "-"}
              />
              <InfoRow label="Project" value={selectedTask.projectName} />
              <InfoRow
                label="Start Date"
                value={selectedTask.startDate || "-"}
              />
              <InfoRow label="Due Date" value={selectedTask.dueDate || "-"} />
              <InfoRow label="Priority" value={selectedTask.priority} />
              <InfoRow label="Status" value={selectedTask.status} />
              <InfoRow
                label="Expired"
                value={
                  isTaskExpired(selectedTask)
                    ? `Yes - ${getDaysLate(selectedTask.dueDate)} day(s) late`
                    : "No"
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "24px",
                paddingTop: "18px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              {canEditOrDelete && (
                <>
                  <button
                    onClick={() => {
                      setEditTask(selectedTask);
                      setSelectedTask(null);
                      setShowForm(true);
                    }}
                    style={actionBtn("#4169E1")}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    style={actionBtn("#ef4444")}
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                style={actionBtn("#64748b")}
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "18px",
            alignItems: "start",
          }}
        >
          {STATUSES.map((statusKey) => {
            const column = columns[statusKey];

            return (
              <Droppable droppableId={statusKey} key={statusKey}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      background: snapshot.isDraggingOver
                        ? "#eef6ff"
                        : "#ffffff",
                      borderRadius: "18px",
                      padding: "16px",
                      minHeight: "500px",
                      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                      borderTop: `5px solid ${getColumnColor(statusKey)}`,
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
                      <h4 style={{ margin: 0, color: "#1e293b" }}>
                        {column.title}
                      </h4>
                      <span
                        style={{
                          minWidth: "28px",
                          textAlign: "center",
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background: "#e2e8f0",
                          color: "#334155",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {column.items.length}
                      </span>
                    </div>

                    {column.items.map((item, index) => {
                      const draggableAllowed = canDragTask(item);
                      const expired = isTaskExpired(item);

                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={!draggableAllowed}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(item)}
                              style={{
                                background: expired ? "#fff5f5" : "#fff",
                                border: expired
                                  ? "2px solid #ef4444"
                                  : "1px solid #e5e7eb",
                                borderLeft: expired
                                  ? "6px solid #dc2626"
                                  : `5px solid ${getColumnColor(statusKey)}`,
                                borderRadius: "14px",
                                padding: "14px",
                                marginBottom: "12px",
                                boxShadow: snapshot.isDragging
                                  ? "0 16px 28px rgba(0,0,0,0.18)"
                                  : "0 4px 12px rgba(15, 23, 42, 0.06)",
                                cursor: draggableAllowed
                                  ? "grab"
                                  : "not-allowed",
                                opacity: draggableAllowed ? 1 : 0.82,
                                transition: "0.2s ease",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    fontSize: "15px",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {item.content}
                                </div>

                                {canEditOrDelete && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditTask(item);
                                      setShowForm(true);
                                    }}
                                    style={{
                                      border: "none",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: "16px",
                                    }}
                                    title="Edit task"
                                  >
                                    ✏️
                                  </button>
                                )}
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "8px",
                                  marginBottom: "10px",
                                }}
                              >
                                <Tag bg="#eff6ff" color="#1d4ed8">
                                  👤 {item.developerName}
                                </Tag>

                                {item.projectName !== "No Project" && (
                                  <Tag bg="#f3e8ff" color="#7e22ce">
                                    📁 {item.projectName}
                                  </Tag>
                                )}

                                <Tag
                                  bg={
                                    item.priority === "HIGH"
                                      ? "#fee2e2"
                                      : item.priority === "MEDIUM"
                                        ? "#fff7ed"
                                        : "#ecfdf5"
                                  }
                                  color={
                                    item.priority === "HIGH"
                                      ? "#b91c1c"
                                      : item.priority === "MEDIUM"
                                        ? "#c2410c"
                                        : "#15803d"
                                  }
                                >
                                  {item.priority}
                                </Tag>

                                {expired && (
                                  <Tag bg="#fee2e2" color="#b91c1c">
                                    🚨 Expired by {getDaysLate(item.dueDate)}{" "}
                                    day
                                    {getDaysLate(item.dueDate) > 1 ? "s" : ""}
                                  </Tag>
                                )}
                              </div>

                              <div
                                style={{
                                  fontSize: "12px",
                                  color: expired ? "#b91c1c" : "#64748b",
                                  fontWeight: expired ? "700" : "400",
                                }}
                              >
                                📅 {item.startDate || "-"} →{" "}
                                {item.dueDate || "-"}
                              </div>

                              {String(item.assignedToId) === String(userId) &&
                                isDeveloper && (
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      display: "inline-block",
                                      background: "#dcfce7",
                                      color: "#166534",
                                      padding: "4px 10px",
                                      borderRadius: "999px",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Your Task
                                  </div>
                                )}

                              {!draggableAllowed && isDeveloper && (
                                <div
                                  style={{
                                    marginTop: "10px",
                                    fontSize: "11px",
                                    color: "#b45309",
                                  }}
                                >
                                  You cannot drag this task because it is not
                                  assigned to you.
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

function Tag({ children, bg, color }) {
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: "12px",
        alignItems: "start",
      }}
    >
      <strong style={{ color: "#334155" }}>{label}:</strong>
      <span style={{ color: "#475569" }}>{value}</span>
    </div>
  );
}

function actionBtn(bg) {
  return {
    flex: 1,
    padding: "11px 16px",
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  };
}
