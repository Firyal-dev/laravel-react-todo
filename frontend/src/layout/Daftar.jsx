import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "./AuthLayout";
import { TypographyH4 } from "../components/ui/typographyh4";
import { SmallText } from "../components/ui/smalltext";
import { useState } from "react";
import axios from "axios";

export default function Daftar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: ""
  })

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register", form);
      alert("Berhasil daftar")

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      alert("Daftar gagal")
    }
  } 

  return (
    <AuthLayout
      title={<TypographyH4>Daftar</TypographyH4>}
      footer={
        <SmallText>
          Udah punya akun?{" "}
          <Link to="/" className="hover:underline transition-all text-blue-500">
            Login
          </Link>
        </SmallText>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama"
        />
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <Button type="submit" className="w-full">
          Konfirmasi
        </Button>
      </form>
    </AuthLayout>
  );
}
