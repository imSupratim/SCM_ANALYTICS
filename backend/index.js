import express from "express";
import cors from "cors";
import analyticsData from "./data.js";

const app = express();
app.use(cors());
app.use(express.json());


let data = { ...analyticsData };

// ✅ Get any dataset
app.get("/api/:dataset", (req, res) => {
  const { dataset } = req.params;
  if (!data[dataset]) return res.status(404).json({ error: "Dataset not found" });
  res.json(data[dataset]);
});

// ✅ Add new record
app.post("/api/:dataset", (req, res) => {
  const { dataset } = req.params;
  const newItem = req.body;

  if (!data[dataset]) return res.status(404).json({ error: "Dataset not found" });

  // Add an auto ID if missing
  newItem.id = newItem.id || Date.now();
  data[dataset].push(newItem);

  res.json({ success: true, updated: data[dataset] });
});


// ✅ Delete record
app.delete("/api/:dataset/:id", (req, res) => {
  const { dataset, id } = req.params;

  if (!data[dataset]) return res.status(404).json({ error: "Dataset not found" });

  const beforeLength = data[dataset].length;
  data[dataset] = data[dataset].filter((item) => item.id?.toString() !== id.toString());

  if (beforeLength === data[dataset].length)
    return res.status(404).json({ error: "Item not found" });

  res.json({ success: true, updated: data[dataset] });
});


// Example API endpoints
app.get("/api/inventory", (req, res) => {
  res.json(analyticsData.inventory);
});

app.get("/api/suppliers", (req, res) => {
  res.json(analyticsData.suppliers);
});

app.get("/api/revenue", (req, res) => {
  res.json(analyticsData.revenue);
});

app.get("/api/orders", (req, res) => {
  res.json(analyticsData.orders);
});

app.get("/api/employees", (req, res) => {
  res.json(analyticsData.employees);
});

app.get("/api/warehouses", (req, res) => {
  res.json(analyticsData.warehouses);
});

app.get("/api/expenses", (req, res) => {
  res.json(analyticsData.expenses);
});


// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
