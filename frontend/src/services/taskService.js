// // API base configuration
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// // Toggle between mock and real API
// const USE_MOCK_DATA = true; // Set to false when backend is ready

// // Mock data (temporary)
// import { tasks as mockTasks } from '../data/tasks.js';

// // API service for tasks
// export const taskService = {
//   // Get all tasks
//   async getTasks() {
//     if (USE_MOCK_DATA) {
//       return Promise.resolve(mockTasks);
//     }
    
//     const response = await fetch(`${API_BASE_URL}/tasks`);
//     if (!response.ok) throw new Error('Failed to fetch tasks');
//     return response.json();
//   },

//   // Create new task
//   async createTask(taskData) {
//     if (USE_MOCK_DATA) {
//       console.log('Mock: Would create task', taskData);
//       return Promise.resolve({ id: Date.now(), ...taskData });
//     }

//     const response = await fetch(`${API_BASE_URL}/tasks`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(taskData),
//     });
//     if (!response.ok) throw new Error('Failed to create task');
//     return response.json();
//   },

//   // Update task
//   async updateTask(id, updates) {
//     if (USE_MOCK_DATA) {
//       console.log('Mock: Would update task', id, updates);
//       return Promise.resolve({ id, ...updates });
//     }

//     const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updates),
//     });
//     if (!response.ok) throw new Error('Failed to update task');
//     return response.json();
//   },

//   // Delete task
//   async deleteTask(id) {
//     if (USE_MOCK_DATA) {
//       console.log('Mock: Would delete task', id);
//       return Promise.resolve({ success: true });
//     }

//     const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
//       method: 'DELETE',
//     });
//     if (!response.ok) throw new Error('Failed to delete task');
//     return response.json();
//   },
// };
