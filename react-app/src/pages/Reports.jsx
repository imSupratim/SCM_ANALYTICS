import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api/orders"),
      axios.get("http://localhost:5000/api/expenses"),
    ]).then(([ordersRes, expensesRes]) => {
      setOrders(ordersRes.data);
      setExpenses(expensesRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-400 border-solid"></div>
        <p className="ml-4 text-lg text-indigo-300 font-semibold">
          Loading reports...
        </p>
      </div>
    );
  }

  // Summary calculations
  const totalOrders = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalExpenses = expenses.reduce(
    (sum, e) =>
      sum + ((e.logistics || 0) + (e.maintenance || 0) + (e.salaries || 0)),
    0
  );
  const avgExpensePerOrder =
    totalOrders > 0 ? (totalExpenses / totalOrders).toFixed(2) : 0;

  // Line chart for monthly expense trend
  const expenseLineData = expenses.map((e) => ({
    month: e.month,
    total: (e.logistics || 0) + (e.maintenance || 0) + (e.salaries || 0),
  }));

  // Pie chart (average category distribution)
  const avgExpense = [
    {
      name: "Logistics",
      value:
        expenses.reduce((sum, e) => sum + (e.logistics || 0), 0) /
        (expenses.length || 1),
    },
    {
      name: "Maintenance",
      value:
        expenses.reduce((sum, e) => sum + (e.maintenance || 0), 0) /
        (expenses.length || 1),
    },
    {
      name: "Salaries",
      value:
        expenses.reduce((sum, e) => sum + (e.salaries || 0), 0) /
        (expenses.length || 1),
    },
  ];

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#c084fc"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-400 mb-8 text-center">
          Reports & Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Orders</h3>
            <p className="text-3xl font-semibold text-white">
              {totalOrders.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Total Expenses</h3>
            <p className="text-3xl font-semibold text-green-400">
              ₹{totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-yellow-500/30 transition-all">
            <h3 className="text-gray-300 text-sm">Avg Expense / Order</h3>
            <p className="text-3xl font-semibold text-yellow-400">
              ₹{avgExpensePerOrder}
            </p>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Orders Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-indigo-300 border-b border-zinc-700">
                  <th className="py-2 px-4">Order ID</th>
                  <th className="py-2 px-4">Customer</th>
                  <th className="py-2 px-4">Item</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-zinc-700 hover:bg-zinc-700/40 transition-all"
                  >
                    <td className="py-2 px-4 text-gray-300">{order.id}</td>
                    <td className="py-2 px-4 text-white">{order.customer}</td>
                    <td className="py-2 px-4 text-indigo-300">{order.item}</td>
                    <td className="py-2 px-4 text-green-400">
                      {order.quantity}
                    </td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-400"
                          : order.status === "Pending"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="py-2 px-4 text-gray-400">
                      {new Date(order.date).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Monthly Expense Trend */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Monthly Expense Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expenseLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#facc15"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Total Expenses (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart Section */}
          <div className="bg-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Average Expense Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={avgExpense}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  dataKey="value"
                >
                  {avgExpense.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Expense Table */}
        <div className="bg-zinc-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300">
            Monthly Expense Details
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-indigo-300 border-b border-zinc-700">
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Logistics (₹)</th>
                <th className="py-2 px-4">Maintenance (₹)</th>
                <th className="py-2 px-4">Salaries (₹)</th>
                <th className="py-2 px-4">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, idx) => {
                const total =
                  (e.logistics || 0) +
                  (e.maintenance || 0) +
                  (e.salaries || 0);
                return (
                  <tr key={idx} className="border-b border-zinc-700">
                    <td className="py-2 px-4">{e.month}</td>
                    <td className="py-2 px-4 text-green-400">
                      ₹{e.logistics.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-yellow-400">
                      ₹{e.maintenance.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-blue-400">
                      ₹{e.salaries.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 font-semibold text-indigo-300">
                      ₹{total.toLocaleString()}
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
