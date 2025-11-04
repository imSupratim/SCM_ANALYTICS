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

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers").then((res) => {
      setSuppliers(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading suppliers...
        </p>
      </div>
    );
  }

  // Summary Calculations
  const totalSuppliers = suppliers.length;
  const totalDeliveries = suppliers.reduce((sum, s) => sum + s.deliveries, 0);
  const avgRating = (
    suppliers.reduce((sum, s) => sum + s.rating, 0) / totalSuppliers
  ).toFixed(1);

  // Group by region for bar chart
  const deliveriesByRegion = suppliers.map((s) => ({
    region: s.region,
    deliveries: s.deliveries,
  }));

  // Donut chart for supplier rating distribution
  const ratingData = suppliers.map((s) => ({
    name: s.name,
    value: s.rating,
  }));

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8 ">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Suppliers Overview
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Suppliers</h3>
            <p className="text-3xl font-semibold text-white">
              {totalSuppliers}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Deliveries</h3>
            <p className="text-3xl font-semibold text-green-400">
              {totalDeliveries}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Average Rating</h3>
            <p className="text-3xl font-semibold text-yellow-400">
              {avgRating} ★
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Bar Chart: Deliveries by Region */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Deliveries by Region
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveriesByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="region" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveries" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Chart: Supplier Ratings */}
          <div className="bg-zinc-800 p-3 rounded-2xl shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-5 text-indigo-300">
              Supplier Ratings Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="value"
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier List */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Supplier Details
          </h2>

          <ul className="divide-y divide-zinc-700">
            {suppliers.map((s, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center py-3 hover:bg-zinc-700/40 rounded-lg px-3 transition"
              >
                <div>
                  <p className="text-gray-200 font-medium">{s.name}</p>
                  <p className="text-sm text-gray-400">{s.region}</p>
                </div>
                <div className="flex flex-col items-end text-sm">
                  <span className="text-yellow-400 mb-1">
                    Rating: {s.rating} ★
                  </span>
                  <span className="text-green-400 mb-1">
                    Deliveries: {s.deliveries}
                  </span>
                  <span className="text-indigo-300">{s.contact}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
