// data/rooms.js
export const rooms = [
  {
    id: "general",
    name: "💬 general",
    type: "general",
    members: [1, 2, 3, 4, 5],
  },

  {
    id: "ml-team",
    name: "🧠 ml-team",
    type: "team",
    members: [1, 2, 3, 5],
  },

  {
    id: "devops-team",
    name: "⚙️ devops-team",
    type: "team",
    members: [1, 4],
  },

  {
    id: "notices",
    name: "📢 special-notices",
    type: "notice",
    members: [1, 2, 3, 4, 5],
  },

  {
    id: "complaints",
    name: "🚨 complaints",
    type: "complaint",
    members: [1], // Sarith only
  },
];
