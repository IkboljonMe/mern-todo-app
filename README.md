# MERN Todo App

A simple full stack todo app built with MongoDB, Express, React and Node.js (MERN).
I made it in June 2024 to practice building a CRUD app with a REST API and a React frontend.
I followed the "Awesome Todos" MERN tutorial ([Notion guide](https://cyber-halibut-5bd.notion.site/Awesome-Todos-MERN-2f0ac0aadf564c39a6acd4652d9da698?pvs=4)) and then changed some parts myself.

There is no live demo right now. You can run it locally with the steps below.

## Features

- Add a new todo (it must be longer than 3 characters)
- See all todos, saved in MongoDB
- Mark a todo as done or not done
- Delete a todo (it asks "Are you sure?" first)
- Shows an error message if the server or database is not working

## Built with

- React 18 (Create React App)
- Node.js + Express 4
- MongoDB (official `mongodb` driver)
- dotenv

## How to run

You need Node.js 18 or newer and a MongoDB database (local, Docker or MongoDB Atlas).

1. Clone the repo and install packages:

```bash
git clone https://github.com/IkboljonMe/mern-todo-app.git
cd mern-todo-app
npm run install-all
```

2. Create the env file for the server:

```bash
cp server/.env.example server/.env
```

If you don't have MongoDB installed, you can start one with Docker:

```bash
docker run -d --name todo-mongo -p 27017:27017 mongo:7
```

3. Build the React app. The build goes into `server/build`, and the server serves it:

```bash
npm run build
```

4. Start the server:

```bash
npm start
```

Open http://localhost:5000.

### Development mode

Run the server and the React dev server in two terminals:

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm start
```

React runs on http://localhost:3000 and sends `/api` requests to the server on port 5000 (the `proxy` setting in `client/package.json`).

Note: the `build` script in `client/package.json` sets `BUILD_PATH` inline, so it works on Linux, macOS and Git Bash. On Windows CMD or PowerShell, run the build from Git Bash or WSL.

## Environment variables

Put these in `server/.env`:

| Name | What it is | Default |
| --- | --- | --- |
| `MONGODB_URI` | MongoDB connection string. Todos are saved in the `todosdb` database, `todos` collection. | `mongodb://localhost:27017/` |
| `PORT` | Port for the Express server | `5000` |

If the server can't connect to MongoDB, it prints the error and stops.

## API routes

| Method | Route | Body | What it does |
| --- | --- | --- | --- |
| GET | `/api/todos` | - | Returns all todos |
| POST | `/api/todos` | `{ "todo": "Buy milk" }` | Creates a todo (201). Returns 400 if `todo` is empty. |
| PUT | `/api/todos/:id` | `{ "status": true }` | Sets the done status of a todo. Returns 400 for a bad id or a non-boolean status, 404 if not found. |
| DELETE | `/api/todos/:id` | - | Deletes a todo. Returns 400 for a bad id, 404 if not found. |

A todo looks like this: `{ "_id": "...", "todo": "Buy milk", "status": false }`

## Project structure

```
client/            React app (Create React App)
  public/
  src/
    App.jsx        form and list of todos
    Todo.jsx       one todo with done and delete buttons
    styles.css
server/            Express API
  index.js         starts the server and serves the React build
  database.js      MongoDB connection
  routes.js        /api/todos routes
  .env.example
package.json       helper scripts (install-all, build, start)
```

---

Made by [IkboljonMe](https://github.com/IkboljonMe)
