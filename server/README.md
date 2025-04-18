# Todo App Backend Server

This is the backend server for the Todo application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login)
- CRUD operations for tasks
- Task filtering by category, completion status
- Task searching

## Development Setup

### Quick Start

The server is configured to use mongodb-memory-server for development, which means you don't need to install MongoDB locally to get started.

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   node index.js
   ```

The server will start on port 5000 (or the port specified in your .env file).

### Configuration

You can configure the server using environment variables in a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/database
JWT_SECRET=your_secret_key
```

Database connection options:

1. **In-memory MongoDB (default fallback)**: No setup required, but data is lost when server restarts
2. **Local MongoDB**: Install MongoDB locally and update MONGODB_URI
3. **MongoDB Atlas**: Sign up for MongoDB Atlas and use the connection string

## Production Setup

For production, you should use a real MongoDB instance:

1. Create a MongoDB Atlas account (free tier available)
2. Create a cluster and get the connection string
3. Update your .env file with the connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get authenticated user (requires token)

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/category/:category` - Get tasks by category
- `GET /api/tasks/status/:status` - Get tasks by completion status
- `GET /api/tasks/search/:keyword` - Search tasks by title 