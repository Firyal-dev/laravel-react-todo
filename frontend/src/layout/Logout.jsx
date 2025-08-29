import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // bersihin localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect ke login
      navigate("/");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-700">
      Logout
    </Button>
  );
}
