// 










import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeForm from "./pages/EmployeeForm";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogin = (userRole) => {
    localStorage.setItem("role", userRole);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    setRole("");
  };

  if (!role) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-xl font-bold">
          {role === "admin" ? "Admin Dashboard" : "Employee Panel"}
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 cursor-pointer px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {role === "admin" ? <AdminDashboard /> : <EmployeeForm />}
    </div>
  );
}
