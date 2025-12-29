/* ===============================
   EMPLOYEES (Dummy Data)
================================ */
export const developers = [
  { id: 1, name: "Alice Johnson", role: "Frontend Developer" },
  { id: 2, name: "Bob Smith", role: "Backend Developer" },
  { id: 3, name: "Charlie Lee", role: "Mobile Developer" },
  { id: 4, name: "Diana Perera", role: "QA Engineer" },
];

/* ===============================
   NOTICE ROOMS (Discord Style)
================================
- all_devs     → Broadcast to all developers
- tl_atl_pm    → Leadership-only room
- emp_X        → Individual DM-style notice rooms
*/
export const noticeRooms = [
  {
    id: "all_devs",
    name: "# All-Developers",
    type: "group",
  },
  {
    id: "tl_atl_pm",
    name: "# TL-ATL-PM",
    type: "group",
  },
  ...developers.map((dev) => ({
    id: `emp_${dev.id}`,
    name: `@ ${dev.name}`,
    type: "dm",
  })),
];

/* ===============================
   NOTICE CHAT HISTORY
   (Each room has its own messages)
================================ */
export const initialNoticeChats = {
  all_devs: [
    {
      id: 1,
      sender: "CEO",
      text: "Welcome developers! Please review the updated project guidelines.",
      time: "09:00 AM",
    },
    {
      id: 2,
      sender: "CEO",
      text: "Stand-up meetings will now be at 10 AM daily.",
      time: "09:05 AM",
    },
  ],

  tl_atl_pm: [
    {
      id: 1,
      sender: "CEO",
      text: "Leadership sync scheduled for today at 3:00 PM.",
      time: "09:15 AM",
    },
    {
      id: 2,
      sender: "CEO",
      text: "Please submit your weekly reports before EOD.",
      time: "09:20 AM",
    },
  ],

  /* ===============================
     INDIVIDUAL NOTICE CHATS
     (DM-style like Discord)
  ================================ */
  emp_1: [
    {
      id: 1,
      sender: "CEO",
      text: "Alice, please focus on the dashboard UI improvements this week.",
      time: "09:30 AM",
    },
  ],

  emp_2: [
    {
      id: 1,
      sender: "CEO",
      text: "Bob, ensure the API performance optimizations are completed.",
      time: "09:35 AM",
    },
  ],

  emp_3: [
    {
      id: 1,
      sender: "CEO",
      text: "Charlie, update the mobile build and share the APK by tomorrow.",
      time: "09:40 AM",
    },
  ],

  emp_4: [
    {
      id: 1,
      sender: "CEO",
      text: "Diana, please prepare the QA checklist for the upcoming release.",
      time: "09:45 AM",
    },
  ],
};
