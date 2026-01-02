import { useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Meeting at 10 AM", read: false },
    { id: 2, text: "New message from John", read: false },
  ]);

  const markRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 max-w-lg mx-auto">
      <h2 className="font-bold text-lg mb-3">🔔 Notifications</h2>

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`p-3 border rounded mb-2 flex justify-between ${
            n.read ? "bg-gray-100" : "bg-white"
          }`}
        >
          <span>{n.text}</span>

          <div className="space-x-2">
            <button className="text-blue-500" onClick={() => markRead(n.id)}>
              {n.read ? "Unread" : "Read"}
            </button>

            <button
              className="text-red-500"
              onClick={() => deleteNotification(n.id)}
            >
              X
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
