import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Greeting from "./Greeting";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { MdEdit, MdDelete } from "react-icons/md";
import Loader from "./Loader"; 

const TodoList = () => {
  const uri = "https://todolist-server-api.onrender.com/todoList/todos";
  let navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    editId: null,
  });
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { title, description, editId } = formData;
  const descriptionInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState("todoList");
  const [searchTerm, setSearchTerm] = useState("");

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      descriptionInputRef.current.focus();
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(uri, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data && res.data.todos) {
        setTodos(res.data.todos);
        setFilteredTodos(res.data.todos);
      } else {
        setTodos([]);
        setFilteredTodos([]);
      }
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/todoList/login");
      console.error(err.response ? err.response.data : err.message);
      toast.error("Not Authorized, Please try login again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // fetchUser();
  }, []);
  if (loading) {
    return <p className="text-center text-4xl place-items-center mt-[2em]">Loading... <Loader /> </p>;
  }

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.warning("Both title and description are required to submit a todo");
      return;
    }

    const newTodo = { title, description };

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (editId) {
        await axios.put(`${uri}/${editId}`, newTodo, { headers });
        setFormData({ title: "", description: "", editId: null });
        fetchTodos();
        toast.success("Todo updated successfully");
      } else {
        const res = await axios.post(uri, newTodo, { headers });
        setTodos([...todos, res.data]);
        setFormData({ title: "", description: "", editId: null });
        toast.success("Todo added successfully");
      }
      fetchTodos();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      toast.error(err.message);
    }
  };

  const onDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (confirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${uri}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(todos.filter((todo) => todo._id !== id));
        setFilteredTodos(filteredTodos.filter((todo) => todo._id !== id));
        toast.success("Todo deleted successfully");
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        toast.error(err.message);
      }
    } else {
      toast.info("Todo deletion canceled");
    }
  };

  const onEdit = (todo) => {
    setFormData({
      title: todo.title,
      description: todo.description,
      editId: todo._id,
    });
  };

  const onToggleComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const todo = todos.find((todo) => todo._id === id);

      const isCompleted = todo.completed;
      await axios.put(
        `${uri}/${id}`,
        { ...todo, completed: !isCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (isCompleted) {
        toast.warning("Task marked as incomplete.");
      } else {
        toast.success("Way to go, you've completed a task!");
      }

      fetchTodos();
    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm)
    );
    setFilteredTodos(filtered);
  };

  return (
    <div className="todo-list">
      <Greeting user={user} />
      {/* <h1>Hi, {userData.firstName}</h1> */}
      <div className="todoList-container">
        <div className="flex justify-between">
          <h2
            onClick={() => setActiveSection("todoList")}
            className={`cursor-pointer lg:text-3xl sm:text-sm ${
              activeSection === "todoList"
                ? "text-blue-600 lg:text-3xl font-bold sm:text-sm"
                : ""
            }`}
          >
            Todo List
          </h2>
          <div className="textInputWrapper">
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              type="text"
              className="textInput"
            />
          </div>
          <h2
            onClick={() => setActiveSection("completedTodos")}
            className={`cursor-pointer lg:text-2xl sm:text-sm ${
              activeSection === "completedTodos"
                ? "text-blue-600 lg:text-2xl font-bold sm:text-sm"
                : ""
            }`}
          >
            Completed Todos
          </h2>
        </div>
        {activeSection === "todoList" && (
          <div className="mb-[4em]">
            {loading ? (
              <p className="text-center text-4xl place-items-center mt-[2em]">Loading todos... <Loader /> </p>
            ) : (
              <ul>
                {filteredTodos.length === 0 ? (
                  <li>No todos found.</li>
                ) : (
                  filteredTodos
                    .filter((todo) => !todo.completed)
                    .map((todo) => (
                      <li className="todo-task-list" key={todo._id}>
                        <details open>
                          <summary className="flex justify-between items-center">
                            <div className="flex items-center">
                              <label className="completed-container">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  onChange={() => onToggleComplete(todo._id)}
                                />
                                <svg
                                  viewBox="0 0 64 64"
                                  height="2em"
                                  width="2em"
                                >
                                  <path
                                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                    pathLength="575.0541381835938"
                                    className="path"
                                  ></path>
                                </svg>
                              </label>
                              <div className="ml-2">
                                <p className="text-sm text-gray-500">
                                  Added on:{" "}
                                  {new Date(todo.createdAt).toLocaleString()}
                                </p>
                                <h3 className="font-bold text-2xl">
                                  {todo.title}
                                </h3>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => onEdit(todo)}>
                                <MdEdit className="text-3xl text-blue-600 hover:scale-150 transition-all" />
                              </button>
                              <button onClick={() => onDelete(todo._id)}>
                                <MdDelete className="text-3xl text-red-600 hover:scale-150 transition-all" />
                              </button>
                            </div>
                          </summary>
                          <p className="text-blue-600">{todo.description}</p>
                        </details>
                      </li>
                    ))
                )}
              </ul>
            )}
          </div>
        )}

        {activeSection === "completedTodos" && (
          <ul>
            {filteredTodos
              .filter((todo) => todo.completed)
              .map((todo) => (
                <li
                  className="completed-task-list flex justify-between"
                  key={todo._id}
                >
                  <div>
                    <h3 className="font-bold text-2xl">{todo.title}</h3>
                    <p>{todo.description}</p>
                  </div>
                  <div>
                    <label className="completed-container">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggleComplete(todo._id)}
                      />
                      <svg viewBox="0 0 64 64" height="2em" width="2em">
                        <path
                          d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                          pathLength="575.0541381835938"
                          className="path"
                        ></path>
                      </svg>
                    </label>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="fixed-bottom-form">
        <input
          className="bg-neutral-600 text-white font-bold font-mono ring-1 ring-neutral-600 transition ease-in outline-none duration-300 placeholder:text-neutral-300 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-md task-input dark:shadow-md dark:shadow-neutral-700"
          autoComplete="off"
          value={title}
          onChange={onChange}
          placeholder="Task Title"
          name="title"
          type="text"
          onKeyDown={handleTitleKeyDown}
        />

        <div className="flex gap-2">
          <input
            className="bg-neutral-600 text-white font-bold font-mono ring-1 ring-neutral-600 transition ease-in outline-none duration-300 placeholder:text-neutral-300 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-md task-input dark:shadow-md dark:shadow-neutral-700 w-[400px]"
            autoComplete="off"
            type="text"
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Task Description"
            ref={descriptionInputRef}
            onKeyDown={handleDescriptionKeyDown}
          />
          <button type="submit">
            {editId ? (
              <FaArrowUpLong className="update-icon" />
            ) : (
              <RiSendPlaneFill className="send-icon" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoList;
