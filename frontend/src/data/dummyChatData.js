export const users = [
  { id: 1, name: "Sarith", role: "PM" },
  { id: 2, name: "Nimal", role: "TL" },
  { id: 3, name: "Kamal", role: "Developer" },
  { id: 4, name: "Ruwan", role: "Developer" },
  { id: 5, name: "Anu", role: "Developer" },
];

export const initialRooms = [
  {
    id: "general",
    name: "💬 General",
    type: "team",
    members: [1, 2, 3, 4, 5],
    messages: [
      { id: 1, userId: 1, text: "Welcome everyone 👋" },
      { id: 2, userId: 3, text: "Good morning team!" },
    ],
  },
  {
    id: "ml-team",
    name: "🧠 ML Team",
    type: "team",
    members: [2, 3, 5],
    messages: [
      { id: 1, userId: 3, text: "Dataset preprocessing completed" },
      { id: 2, userId: 2, text: "Great, start model training" },
    ],
  },
  {
    id: "devops-team",
    name: "⚙️ DevOps Team",
    type: "team",
    members: [1, 4],
    messages: [{ id: 1, userId: 4, text: "CI/CD pipeline deployed" }],
  },
  {
    id: "notices",
    name: "Special Notices",
    type: "notice",
    members: [1, 2, 3, 4, 5],
    messages: [{ id: 1, userId: 1, text: "Sprint review on Friday" }],
  },
  {
    id: "complaints",
    name: "Complaints",
    type: "complaint",
    members: [1, 2],
    messages: [],
  },
];
