import React from 'react';
import { Outlet } from 'react-router-dom';

const TodoListLayout = () => {
  return (
    <div className='layout'>
      <Outlet />
    </div>
  );
};

export default TodoListLayout;
