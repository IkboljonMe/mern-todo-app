import React, { useState } from "react";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateTodo = async (todoId, newStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error();

      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: newStatus };
          }
          return currentTodo;
        });
      });
    } catch {
      alert("Could not update the todo. Please try again.");
    }
  };

  const deleteTodo = () => {
    // Display confirmation dialog
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      // 404 means it is already gone, so we can remove it from the list too
      if (!res.ok && res.status !== 404) throw new Error();

      setTodos((currentTodos) => {
        return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
      });
    } catch {
      alert("Could not delete the todo. Please try again.");
    }
    // Close confirmation dialog
    setConfirmDelete(false);
  };

  const handleDeleteCancel = () => {
    // Close confirmation dialog
    setConfirmDelete(false);
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, !todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button className="todo__delete" onClick={deleteTodo}>
          🗑️
        </button>
      </div>
      {confirmDelete && (
        <div className="confirmation">
          <p>Are you sure you want to delete this todo?</p>
          <div className="confirmation__buttons">
            <button onClick={() => handleDeleteConfirm(todo._id)}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
