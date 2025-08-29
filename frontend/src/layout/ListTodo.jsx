import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Logout from "../layout/Logout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function ListTodo() {
  const navigate = useNavigate();

  // State untuk todos
  const [todos, setTodos] = useState([]);

  // State untuk loading
  const [loading, setLoading] = useState(true);

  // State untuk error
  const [error, setError] = useState("");

  // Fetch todos dari backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:8000/api/todo", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setTodos(response.data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);

      if (error.response?.status === 401) {
        // Token expired atau invalid, redirect ke login
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Gagal mengambil data todos");
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!window.confirm("Yakin mau hapus todo ini?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/todo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Hapus todo dari state tanpa perlu fetch ulang
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("Gagal menghapus todo");
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Cek apakah todo sudah lewat deadline
  const isOverdue = (dateString) => {
    const todoDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return todoDate < today;
  };

  // useEffect untuk fetch data ketika component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div>
        {/* nav */}
        <div className="flex justify-center mb-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/listtodo">List Todo</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/addtodo">Add Todo</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Logout />
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* nav */}
      <div className="flex justify-center mb-8">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/listtodo">List Todo</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/addtodo">Add Todo</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Logout />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <Button
            onClick={fetchTodos}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* List todos */}
      <div className="bg-white rounded-lg shadow mx-15">
        <Table>
          <TableCaption>
            {todos.length === 0
              ? "Belum ada todo. Mulai dengan menambahkan todo pertama!"
              : `Total ${todos.length} todo${todos.length > 1 ? "s" : ""}`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Todo</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>Belum ada todo</p>
                  <Link
                    to="/addtodo"
                    className="text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Tambah Todo Pertama
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              todos.map((todo, index) => (
                <TableRow key={todo.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{todo.title}</div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={todo.desc}>
                      {todo.desc || (
                        <span className="text-gray-400 italic">
                          Tidak ada deskripsi
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span
                        className={
                          isOverdue(todo.date) ? "text-red-600 font-medium" : ""
                        }
                      >
                        {formatDate(todo.date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        isOverdue(todo.date) ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {isOverdue(todo.date) ? "Overdue" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/edittodo/${todo.id}`)}
                        className="h-8 w-8 p-0"
                        title="Edit todo"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Hapus todo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quick action button */}
      {todos.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/addtodo")} size="lg">
            Tambah Todo Baru
          </Button>
        </div>
      )}
    </div>
  );
}
