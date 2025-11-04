import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const API_BASE = "https://scm-analytics-backend.onrender.com/api";

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/revenue`),
      axios.get(`${API_BASE}/inventory`),
      axios.get(`${API_BASE}/orders`),
      axios.get(`${API_BASE}/expenses`),
      axios.get(`${API_BASE}/employees`),
    ]).then(([rev, inv, ord, exp, emp]) => {
      setRevenue(rev.data);
      setInventory(inv.data);
      setOrders(ord.data);
      setExpenses(exp.data);
      setEmployees(emp.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading analytics data...
        </p>
      </div>
    );
  }

  const COLORS = ["#4ade80", "#facc15", "#60a5fa", "#a855f7", "#f472b6"];

  const orderStatusData = [
    { name: "Delivered", value: orders.filter((o) => o.status === "Delivered").length },
    { name: "Pending", value: orders.filter((o) => o.status === "Pending").length },
    { name: "Shipped", value: orders.filter((o) => o.status === "Shipped").length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-10 text-center">
          Analytics Dashboard
        </h1>

        {/* REVENUE CHART */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10 hover:shadow-indigo-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Revenue & Profit Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#facc15" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INVENTORY PIE CHART */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10 hover:shadow-indigo-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Inventory Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventory}
                dataKey="quantity"
                nameKey="item"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {inventory.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ORDER STATUS DONUT CHART */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10 hover:shadow-indigo-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Order Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* EXPENSES BAR CHART */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10 hover:shadow-indigo-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Monthly Expenses Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="logistics" stackId="a" fill="#60a5fa" />
              <Bar dataKey="maintenance" stackId="a" fill="#f59e0b" />
              <Bar dataKey="salaries" stackId="a" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* EMPLOYEES PERFORMANCE */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Employee Performance & Efficiency
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employees}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="performance" fill="#6366f1" />
              <Bar dataKey="efficiency" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
