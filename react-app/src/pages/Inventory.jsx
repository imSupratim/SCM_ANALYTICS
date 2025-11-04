import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/inventory").then((res) => {
      setInventory(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading inventory data...
        </p>
      </div>
    );
  }

  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, i) => sum + i.quantity, 0);
  const lowStockCount = inventory.filter(
    (i) => i.quantity <= i.reorderLevel
  ).length;

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EC4899", "#14B8A6"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8 ">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Inventory Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Items</h3>
            <p className="text-3xl font-semibold text-white">{totalItems}</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Quantity</h3>
            <p className="text-3xl font-semibold text-green-400">
              {totalQuantity}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Low Stock Items</h3>
            <p className="text-3xl font-semibold text-yellow-400">
              {lowStockCount}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Inventory Bar Chart */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Inventory Levels by Item
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="item" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#4ade80" name="Quantity" />
                <Bar dataKey="reorderLevel" fill="#facc15" name="Reorder Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Inventory Distribution (by Quantity)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={inventory}
                  dataKey="quantity"
                  nameKey="item"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  label
                >
                  {inventory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-300">
              Detailed Inventory
            </h2>
            <span className="text-sm text-gray-400">
              Last Updated: {new Date().toLocaleString()}
            </span>
          </div>

          <ul className="divide-y divide-zinc-700">
            {inventory.map((i) => (
              <li
                key={i.item}
                className="flex justify-between items-center py-3 hover:bg-zinc-700/40 rounded-lg px-3 transition"
              >
                <span className="text-gray-200 font-medium">{i.item}</span>
                <div className="flex space-x-6 text-sm">
                  <span className="text-green-400">
                    Qty: {i.quantity}
                  </span>
                  <span
                    className={`${
                      i.quantity <= i.reorderLevel
                        ? "text-red-400 font-semibold"
                        : "text-yellow-400"
                    }`}
                  >
                    Reorder: {i.reorderLevel}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
