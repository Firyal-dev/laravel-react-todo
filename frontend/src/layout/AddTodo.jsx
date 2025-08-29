import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "./AuthLayout";
import { TypographyH4 } from "../components/ui/typographyh4";
import { SmallText } from "../components/ui/smalltext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import Logout from "../layout/Logout";

export default function AddTodo() {
  const navigate = useNavigate();

  // State untuk form
  const [form, setForm] = useState({
    title: "",
    desc: "",
  });

  // State untuk date picker
  const [date, setDate] = useState();

  // Handle change input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      // Validasi basic
      if (!form.title.trim()) {
        setMessage("Title wajib diisi!");
        return;
      }

      if (!date) {
        setMessage("Tanggal wajib dipilih!");
        return;
      }

      // Data yang akan dikirim ke backend
      const todoData = {
        title: form.title,
        desc: form.desc,
        date: format(date, "yyyy-MM-dd"), // Format date untuk MySQL
        user_id: localStorage.getItem("user_id"), // Asumsi user_id disimpan di localStorage
      };

      // Kirim ke backend Laravel
      const response = await axios.post(
        "http://localhost:8000/api/todo",
        todoData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asumsi pake token auth
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Kegiatan berhasil ditambahkan");

        // Reset form
        setForm({ title: "", desc: "" });
        setDate(undefined);

        // Redirect ke list todo setelah 1 detik
        setTimeout(() => {
          navigate("/listtodo");
        }, 1000);
      }
    } catch (error) {
      console.error("Error adding todo:", error);

      if (error.response?.data?.message) {
        console.log(error.response.data.message);
      } else {
        alert("Gagal menambahkan aktivitas");
      }
    }
  };

  return (
    <div>
      {/* nav */}
      <div className="flex justify-center">
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

      {/* form */}
      <div>
        <AuthLayout
          title={<TypographyH4>Tambah Todo</TypographyH4>}
          footer={
            <SmallText>
              <Link
                to="/listtodo"
                className="hover:underline transition-all text-blue-500"
              >
                Kembali ke List Todo
              </Link>
            </SmallText>
          }
        >
          <form onSubmit={handleAdd} className="space-y-3">
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Mau ngapain hari ini?"
              required
            />
            <Textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              placeholder="Deskripsi (opsional)"
              rows={3}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!date}
                  className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd MMMM yyyy")
                  ) : (
                    <span>Pilih tanggal</span>  
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <Button type="submit" className="w-full">
              Tambah Todo
            </Button>
          </form>
        </AuthLayout>
      </div>
    </div>
  );
}
