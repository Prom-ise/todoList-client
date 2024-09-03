import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Homepage from "./pages/Homepage";
import ForgotPassword from "./components/ForgotPassword";
import TodoListLayout from "./layout/Layout";
import TodoList from "./pages/TodoList";
import FileUpload from "./pages/FileUpload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer className={"fixed"} />
      <Routes>
        <Route path="/" element={<Navigate to="/todoList/homepage" />} />
        <Route path="/todoList/homepage" element={<Homepage />} />
        <Route path="/todoList/login" element={<Login />} />
        <Route path="/todoList/register" element={<Register />} />
        <Route path="/todoList/forgotPassword" element={<ForgotPassword />} />

        <Route element={<TodoListLayout />}>
          <Route path="/todoList/todo-list" element={<TodoList />} />
          <Route path="/todoList/upload" element={<FileUpload />} />
        </Route>

        <Route path="*" element={<Navigate to="/todoList/homepage" />} />
      </Routes>
    </>
  );
}

export default App;
