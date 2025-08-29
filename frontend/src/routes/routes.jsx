import { Routes, Route } from "react-router-dom";
import Login from "../layout/Login";
import Daftar from "../layout/Daftar";
import ListTodo from "../layout/ListTodo"
import AddTodo from "../layout/AddTodo"
import Logout from "../layout/Logout"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/daftar" element={<Daftar />} />
      <Route path="/listtodo" element={<ListTodo />} />
      <Route path="/addtodo" element={<AddTodo />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
}
