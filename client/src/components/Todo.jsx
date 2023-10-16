import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

const Todo = ({ todos, completeTodo, removeTodo, updateTodo }) => {
  const [edit, setEdit] = useState({
    _id: null,
    todo: ''
  });

  const submitUpdate = async value => {
    await updateTodo(value);
    setEdit({
      _id: null,
      todo: ''
    });
  };

  if (edit.id) {
    return <TodoForm edit={edit} onSubmit={submitUpdate} />;
  }

  return todos.map((todo, index) => (
    <div
      className={todo.isCompleted ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div key={todo._id} onClick={() => completeTodo(todo._id)}>
        {todo.todo}
      </div>
      <div className='icons'>
        <RiCloseCircleLine
          onClick={() => removeTodo(todo._id)}
          className='delete-icon'
        />
        <TiEdit
          onClick={() => setEdit({ id: todo._id, value: todo.todo })}
          className='edit-icon'
        />
      </div>
    </div>
  ));
};

export default Todo;
