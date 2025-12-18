# Backend Schema Requirements

## Task Schema - Required Fields

The frontend works with the Task model fields provided by backend:

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String, // 'Pending' | 'In Progress' | 'On Hold' | 'Completed'
  assignedTo: {
    _id: ObjectId,
    name: String
  },
  assignedBy: ObjectId (ref: Employee),
  project: String or ObjectId,
  createdAt: Date,
  updatedAt: Date,
}
```

## Daily Summary Schema

Frontend ready for DailySummary with:
- employee: ObjectId
- project: ObjectId
- date: Date
- summaryText: String

## Weekly Progress Schema

Frontend ready for WeeklyProgress with:
- employee: ObjectId
- weekStart: Date
- weekEnd: Date
- progressNotes: String
- project: ObjectId
- task: ObjectId

## API Endpoints Needed

### GET /api/tasks
Returns array of tasks with assignedTo populated (name, _id)

### POST /api/tasks
Create task with: title, description, assignedTo, project, status

### PUT /api/tasks/:id
Update task

### DELETE /api/tasks/:id
Delete task

## Frontend Integration

The frontend is ready to use real API:
1. Update `USE_MOCK_DATA = false` in `/frontend/src/services/taskService.js`
2. Set `VITE_API_URL` environment variable to backend URL
3. Ensure CORS is enabled on backend

