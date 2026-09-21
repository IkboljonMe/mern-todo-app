import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) throw new Error();
        const todos = await res.json();

        setTodos(todos);
      } catch {
        setError("Could not load todos. Is the server running?");
      }
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.trim().length > 3) {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          body: JSON.stringify({ todo: content.trim() }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error();
        const newTodo = await res.json();

        setError("");
        setContent("");
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      } catch {
        setError("Could not create the todo. Please try again.");
      }
    } else {
      setError("A todo must be longer than 3 characters.");
    }
  };

  return (
    <main className="container">
      <h1 className="title">Todo APP</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button className="form__button" type="submit">
          Create Todo
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} />
          ))}
      </div>
    </main>
  );
}
