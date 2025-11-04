import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";


const API_BASE = "https://scm-analytics-backend.onrender.com/api";

export default function Dashboard() {
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line"); // toggle between line/bar

  useEffect(() => {
    axios.get(`${API_BASE}/revenue`).then((res) => {
      setRevenue(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading data...
        </p>
      </div>
    );
  }

  const totalSales = revenue.reduce((sum, r) => sum + r.sales, 0);
  const totalProfit = revenue.reduce((sum, r) => sum + r.profit, 0);

  // Pie chart data — total sales vs total profit
  const pieData = [
    { name: "Total Sales", value: totalSales },
    { name: "Total Profit", value: totalProfit },
  ];

  const COLORS = ["#4ade80", "#facc15"]; // green and yellow

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8 ">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Revenue Dashboard
        </h1>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Months</h3>
            <p className="text-3xl font-semibold text-white">{revenue.length}</p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Sales</h3>
            <p className="text-3xl font-semibold text-green-400">
              ₹{totalSales.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Profit</h3>
            <p className="text-3xl font-semibold text-yellow-400">
              ₹{totalProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Chart Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-indigo-300">
            Revenue Trends
          </h2>
          <button
            onClick={() =>
              setChartType(chartType === "line" ? "bar" : "line")
            }
            className="px-4 py-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
          >
            Switch to {chartType === "line" ? "Bar" : "Line"} Chart
          </button>
        </div>

        {/* Chart Section */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "line" ? (
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4ade80"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#facc15"
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#4ade80" />
                <Bar dataKey="profit" fill="#facc15" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl mb-10 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Overall Sales vs Profit
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue List */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Monthly Breakdown
          </h2>

          <ul className="divide-y divide-zinc-700">
            {revenue.map((r) => (
              <li
                key={r.month}
                className="flex justify-between items-center py-3 hover:bg-zinc-700/40 rounded-lg px-3 transition"
              >
                <span className="text-gray-200 font-medium">{r.month}</span>
                <div className="flex space-x-6 text-sm">
                  <span className="text-green-400">
                    Sales: ₹{r.sales.toLocaleString()}
                  </span>
                  <span className="text-yellow-400">
                    Profit: ₹{r.profit.toLocaleString()}
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
