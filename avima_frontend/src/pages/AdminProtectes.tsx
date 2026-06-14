import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AdminProtectes = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
   const token = user?.token;
  const role = user?.role;
  const navigate = useNavigate();
  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    }
  }, [role, token, navigate]);

  return <Outlet />;
};

export default AdminProtectes;
