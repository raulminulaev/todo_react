import React, { useEffect } from "react";
import TodoList from "./Todo/TodoList";
import Context from "./context";
import Loader from "./Loader";
import Modal from "./Modal/Modal";

const AddTodo = React.lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(import("./Todo/AddTodo"));
      }, 3000);
    })
);
// React.lazy позволяет рендерить динам. ипорт как обычный компонент и автоматически загрузит, когда он будет впервые отрендерен.

function App() {
  const [loading, setLoading] = React.useState([true]);
  const [todos, setTodos] = React.useState([]);
  // { id: 1, completed: false, title: "Изучить React" },
  // { id: 2, completed: true, title: "Пройти игру" },
  // { id: 3, completed: false, title: "Закончить Todo" },

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos);
          setLoading(false);
        }, 2000);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function addTodo(title) {
    setTodos(
      todos.concat([
        {
          title,
          id: Date.now(),
          completed: false,
        },
      ])
    );
  }

  // Привязка ф-ии removeTodo через контекст, дает использовать его в TodoItem
  return (
    <Context.Provider value={{ removeTodo }}>
      <div className="wrapper">
        <h1>On React.js</h1>
        <Modal />
        <React.Suspense fallback={"Loading..."}>
          <AddTodo onCreate={addTodo} />
        </React.Suspense>
        {loading && <Loader />}
        {todos.length ? (
          <TodoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No todos!</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
