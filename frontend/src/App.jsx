import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskForm from "./TaskForm";

const initialData = {
  todo: {
    title: "To Do",
    items: [
      { id: "1", content: "Design Kanban UI" },
      { id: "2", content: "Setup Drag & Drop" },
    ],
  },
  inprogress: {
    title: "In Progress",
    items: [{ id: "3", content: "Build React Components" }],
  },
  done: {
    title: "Done",
    items: [{ id: "4", content: "Create Vite Project" }],
  },
};

export default function App() {
  const [columns, setColumns] = useState(initialData);
  const [showForm, setShowForm] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const addTask = (status, newTask) => {
    setColumns(prev => ({
      ...prev,
      [status]: {
        ...prev[status],
        items: [...prev[status].items, newTask]
      }
    }));
  };

  return (
    <div style={{
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
    }}>
      {/* Header with Assign Task Button */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}>
        <h2 style={{ margin: 0, color: "#333" }}>Kanban Board</h2>
        <button
          onClick={() => setShowForm(true)}
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
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onAddTask={addTask}
          onClose={() => setShowForm(false)}
        />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}>
          {Object.entries(columns).map(([id, column]) => (
            <Droppable droppableId={id} key={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: "#f4f5f7",
                    padding: "16px",
                    width: "250px",
                    minHeight: "400px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}>
                    <h4 style={{ margin: 0, color: "#333" }}>{column.title}</h4>
                    <span style={{
                      background: "#ddd",
                      color: "#333",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>
                      {column.items.length}
                    </span>
                  </div>
                  
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            padding: "12px",
                            margin: "0 0 8px 0",
                            background: "white",
                            borderRadius: "6px",
                            boxShadow: snapshot.isDragging 
                              ? "0 5px 15px rgba(0,0,0,0.2)" 
                              : "0 1px 3px rgba(0,0,0,0.2)",
                            borderLeft: `4px solid ${
                              id === 'todo' ? '#FF9800' :
                              id === 'inprogress' ? '#2196F3' :
                              '#4CAF50'
                            }`,
                            cursor: snapshot.isDragging ? "grabbing" : "grab",
                            transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                            transition: "all 0.2s ease",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div style={{
                            fontWeight: "500",
                            marginBottom: "6px",
                            fontSize: "14px",
                            color: "#333",
                          }}>
                            {item.content}
                          </div>
                          
                          {item.developer && (
                            <div style={{
                              fontSize: "12px",
                              color: "#666",
                              marginBottom: "4px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}>
                              👤 {item.developer}
                            </div>
                          )}
                          
                          {item.project && (
                            <div style={{
                              fontSize: "11px",
                              color: "#7b1fa2",
                              backgroundColor: "#f3e5f5",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              display: "inline-block",
                              marginBottom: "4px",
                            }}>
                              📁 {item.project}
                            </div>
                          )}
                          
                          {item.dueDate && (
                            <div style={{
                              fontSize: "11px",
                              color: "#888",
                              marginTop: "4px",
                              paddingTop: "4px",
                              borderTop: "1px solid #eee",
                            }}>
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