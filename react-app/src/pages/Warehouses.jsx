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

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/warehouses").then((res) => {
      setWarehouses(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading warehouses...
        </p>
      </div>
    );
  }

  // Summary calculations
  const totalWarehouses = warehouses.length;
  const totalCapacity = warehouses.reduce(
    (sum, w) => sum + (Number(w.capacity) || 0),
    0
  );
  const totalUsed = warehouses.reduce(
    (sum, w) => sum + (Number(w.used) || 0),
    0
  );
  const overallUtilization =
    totalCapacity > 0 ? Number(((totalUsed / totalCapacity) * 100).toFixed(1)) : 0;

  // Chart data
  const barData = warehouses.map((w) => ({
    location: w.location,
    capacity: Number(w.capacity) || 0,
    used: Number(w.used) || 0,
  }));

  const pieData = warehouses.map((w) => {
    const used = Number(w.used) || 0;
    const cap = Number(w.capacity) || 0;
    const pct = cap > 0 ? Number(((used / cap) * 100).toFixed(1)) : 0;
    return { name: w.location, value: pct };
  });

  const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Warehouses Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Warehouses</h3>
            <p className="text-3xl font-semibold text-white">{totalWarehouses}</p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Capacity</h3>
            <p className="text-3xl font-semibold text-green-400">
              {totalCapacity.toLocaleString()} units
            </p>
          </div>

          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Overall Utilization</h3>
            <p className="text-3xl font-semibold text-yellow-400">
              {overallUtilization}%
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Bar Chart */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Capacity vs Used Space
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="location" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="capacity" fill="#4ade80" name="Capacity" />
                <Bar dataKey="used" fill="#facc15" name="Used" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Warehouse Utilization (%)
            </h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Warehouse List */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Warehouse Details
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-indigo-300 border-b border-zinc-700">
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Capacity</th>
                <th className="py-2 px-4">Used</th>
                <th className="py-2 px-4">Utilization (%)</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w) => {
                const used = Number(w.used) || 0;
                const cap = Number(w.capacity) || 0;
                const utilization = cap > 0 ? ((used / cap) * 100).toFixed(1) : 0;
                return (
                  <tr key={w.location} className="border-b border-zinc-700">
                    <td className="py-2 px-4">{w.location}</td>
                    <td className="py-2 px-4">{w.capacity.toLocaleString()}</td>
                    <td className="py-2 px-4">{w.used.toLocaleString()}</td>
                    <td className="py-2 px-4 text-yellow-400">
                      {utilization}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
