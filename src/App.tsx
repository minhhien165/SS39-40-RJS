import React, { useState } from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdb-ui-kit/css/mdb.min.css';
import TodoList from './components/TodoList';

export default function App() {
  return (
    <div>
      App
      <TodoList/>
    </div>
  );
}
