import React, { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './Todo';
import axios from 'axios';

function TodoList({ profile }) {

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, [profile])
  const getTodos = async () => {
    if (!profile) return setTodos([]);
    try {
      const response = await axios.get('https://mern-todo-server-sohaib.vercel.app/todos', {
        params: {
          email: profile.email,
        }
      })
      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  }


  const addTodo = async todo => {
    if (!todo.id && todo.text) {
      try {
        const response = await axios.post('https://mern-todo-server-sohaib.vercel.app/todos', {
          email: profile.email,
          todo: todo.text.trim(),
        })
        setTodos([...todos, response.data]);
      } catch (error) {
        console.log("Couldn't create new todo", error.message)
      }
    }
    else {
      setTodos([...todos])
    }
  };

  const updateTodo = async ({ id, text }) => {
    try {

      await axios.put(`https://mern-todo-server-sohaib.vercel.app/todos/${id}`, {
        email: profile.email,
        todo: text,
      })

      setTodos(todos.map(item => {
        if (item._id == id) {
          return { ...item, todo: text }
        }
        return item;
      }))
    } catch (error) {
      console.log("Couldn't update todo", error.message)
    }
  };

  const removeTodo = async id => {
    try {
      await axios.delete(`https://mern-todo-server-sohaib.vercel.app/todos/${id}`, {
        params: {
          email: profile.email,
        }
      })
      setTodos(todos.filter(todo => {
        if (todo._id !== id)
          return true;
      }))
    } catch (error) {
      console.log("Couldn't delete todo", error.message)
    }

  };
  const completeTodo = async (id) => {
    try {
      await axios.patch(`https://mern-todo-server-sohaib.vercel.app/todos/${id}`, {
        email: profile.email,
      })
      let temp = [...todos];
      temp = temp.map((todo) => {
        if (todo._id === id)
          todo.isCompleted = !todo.isCompleted;
        return todo;
      });
      setTodos(temp);
    } catch (error) {
      console.log("Could not toggle todo", error.message)
    }

  };

  return (
    <>
      {
        profile ? <h1>Welcome {profile.given_name}!</h1> : <h1>Login to save Tasks</h1>
      }

      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;
