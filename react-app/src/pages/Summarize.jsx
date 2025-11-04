import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";

const API_BASE = "https://scm-analytics-backend.onrender.com/api";

const Summary = () => {
  const [data, setData] = useState({
    inventory: [],
    suppliers: [],
    revenue: [],
    orders: [],
    employees: [],
    warehouses: [],
    expenses: [],
  });

  const [loading, setLoading] = useState(true);

  // Fetch all APIs together
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          inventoryRes,
          suppliersRes,
          revenueRes,
          ordersRes,
          employeesRes,
          warehousesRes,
          expensesRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/inventory`),
          axios.get(`${API_BASE}/suppliers`),
          axios.get(`${API_BASE}/revenue`),
          axios.get(`${API_BASE}/orders`),
          axios.get(`${API_BASE}/employees`),
          axios.get(`${API_BASE}/warehouses`),
          axios.get(`${API_BASE}/expenses`),
        ]);

        setData({
          inventory: inventoryRes.data,
          suppliers: suppliersRes.data,
          revenue: revenueRes.data,
          orders: ordersRes.data,
          employees: employeesRes.data,
          warehouses: warehousesRes.data,
          expenses: expensesRes.data,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <div className="text-center text-white p-10">Loading summary...</div>;

  // ---- Calculations ----
  const totalRevenue = data.revenue.reduce((sum, r) => sum + r.sales, 0);
  const totalProfit = data.revenue.reduce((sum, r) => sum + r.profit, 0);
  const totalExpenses = data.expenses.reduce(
    (sum, e) => sum + e.logistics + e.maintenance + e.salaries,
    0
  );
  const totalOrders = data.orders.length;
  const deliveredOrders = data.orders.filter(o => o.status === "Delivered").length;

  const totalInventoryValue = data.inventory.reduce(
    (sum, i) => sum + i.quantity * i.unitPrice,
    0
  );

  const totalWarehouses = data.warehouses.length;
  const avgUtilization =
    data.warehouses.reduce((sum, w) => sum + (w.used / w.capacity) * 100, 0) /
    totalWarehouses;

  const topSupplier = data.suppliers.reduce((best, s) =>
    s.rating > best.rating ? s : best
  );

  // ---- Generate PDF ----


  const generatePDF = () => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });

  // --- Font size constants (pts) ---
  const HEADING = 18;
  const SUBHEADING = 14;
  const BODY = 12;
  const TABLE = 11;
  const LEFT_MARGIN = 40;
  let y = 40;

  // Title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(HEADING);
  doc.text("📊 Supply Chain Summary Report", LEFT_MARGIN, y);

  // Summary block
  y += 28;
  doc.setFontSize(BODY);
  const lineHeight = BODY * 1.4; // improves vertical spacing

  doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString()}`, LEFT_MARGIN, y);
  y += lineHeight;
  doc.text(`Total Profit: ₹${totalProfit.toLocaleString()}`, LEFT_MARGIN, y);
  y += lineHeight;
  doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, LEFT_MARGIN, y);
  y += lineHeight;
  doc.text(
    `Total Orders: ${totalOrders} (Delivered: ${deliveredOrders})`,
    LEFT_MARGIN,
    y
  );
  y += lineHeight;
  doc.text(
    `Total Inventory Value: ₹${totalInventoryValue.toLocaleString()}`,
    LEFT_MARGIN,
    y
  );
  y += lineHeight;
  doc.text(`Average Warehouse Utilization: ${avgUtilization.toFixed(1)}%`, LEFT_MARGIN, y);
  y += lineHeight;
  doc.text(`Top Supplier: ${topSupplier.name} (${topSupplier.rating}⭐)`, LEFT_MARGIN, y);

  // --- Warehouse Utilization Table ---
  y += 30;
  doc.setFontSize(SUBHEADING);
  doc.text("Warehouse Utilization:", LEFT_MARGIN, y);

  // ensure doc font size resets for table content
  const warehouseTableStartY = y + 10;
  autoTable(doc, {
    startY: warehouseTableStartY,
    styles: { fontSize: TABLE, cellPadding: 6, halign: "left", valign: "middle" },
    headStyles: { fillColor: [41, 128, 185], fontSize: TABLE },
    head: [["Location", "Capacity", "Used", "Utilization %"]],
    body: data.warehouses.map((w) => [
      w.location,
      w.capacity.toString(),
      w.used.toString(),
      ((w.used / w.capacity) * 100).toFixed(1) + "%",
    ]),
    margin: { left: LEFT_MARGIN, right: LEFT_MARGIN },
  });

  // After autoTable, reset normal text size (autoTable may have changed it)
  doc.setFontSize(BODY);

  // Get Y position after the table
  const afterWarehouseY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 30 : warehouseTableStartY + 120;

  // Expense Breakdown heading
  doc.setFontSize(SUBHEADING);
  doc.text("Expense Breakdown:", LEFT_MARGIN, afterWarehouseY);

  // Expense table
  const expenseTableStartY = afterWarehouseY + 10;
  autoTable(doc, {
    startY: expenseTableStartY,
    styles: { fontSize: TABLE, cellPadding: 6, halign: "left", valign: "middle" },
    headStyles: { fillColor: [52, 73, 94], fontSize: TABLE },
    head: [["Month", "Logistics", "Maintenance", "Salaries"]],
    body: data.expenses.map((e) => [
      e.month,
      `₹${e.logistics.toLocaleString()}`,
      `₹${e.maintenance.toLocaleString()}`,
      `₹${e.salaries.toLocaleString()}`,
    ]),
    margin: { left: LEFT_MARGIN, right: LEFT_MARGIN },
  });

  // Reset font size for any footer text if needed
  doc.setFontSize(BODY);

  // Save
  doc.save("SupplyChain_Summary.pdf");
};



  // ---- UI ----
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">
        Supply Chain Summary Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Total Profit</h3>
          <p className="text-2xl font-bold text-blue-400">₹{totalProfit.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString()}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Orders (Delivered)</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {deliveredOrders}/{totalOrders}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Total Inventory Value</h3>
          <p className="text-2xl font-bold text-purple-400">
            ₹{totalInventoryValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Avg Warehouse Utilization</h3>
          <p className="text-2xl font-bold text-pink-400">{avgUtilization.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Top Supplier</h3>
        <p className="text-lg font-bold text-indigo-400">
          {topSupplier.name} ({topSupplier.rating}⭐) — {topSupplier.region}
        </p>
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={generatePDF}
          className="flex items-center cursor-pointer  gap-2 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200"
        > 
          <FileDown className="w-5 h-5" /> Download as PDF
        </button>
      </div>
    </div>
  );
};

export default Summary;
