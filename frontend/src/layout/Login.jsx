import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "./AuthLayout";
import { TypographyH4 } from "../components/ui/typographyh4";
import { SmallText } from "../components/ui/smalltext";
import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [nama, setNama] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        nama,
        password,
      })

      localStorage.setItem("token", res.data.token)
      alert("Berhasil login")
      navigate("/listtodo")
    } catch (err) {
      console.error(err)
      alert("Login gagal")
    }
  }

  return (
    <AuthLayout
      title={<TypographyH4>Login</TypographyH4>}
      footer={
        <SmallText>
          Belum punya akun?{" "}
          <Link
            to="/daftar"
            className="hover:underline transition-all text-blue-500"
          >
            Daftar
          </Link>
        </SmallText>
      }
    >
      <form onSubmit={handleLogin} className="space-y-3">
        <Input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <Button type="submit" className="w-full">
          Konfirmasi
        </Button>
      </form>
    </AuthLayout>
  );
}
