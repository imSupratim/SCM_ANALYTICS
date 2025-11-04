import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeForm() {
  const [dataset, setDataset] = useState("inventory");
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5000/api";

  // ✅ Define field structures per dataset
  const datasetFields = {
    inventory: ["item", "quantity", "reorderLevel", "unitPrice"],
    suppliers: ["name", "rating", "deliveries", "region", "contact"],
    orders: ["customer", "item", "quantity", "status", "date"],
    employees: ["name", "department", "performance", "efficiency"],
    warehouses: ["location", "capacity", "used"],
    expenses: ["month", "logistics", "maintenance", "salaries"],
  };

  // Fetch dataset
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${dataset}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    setForm({}); // reset form when dataset changes
  }, [dataset]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add record
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE}/${dataset}`, form);
//       setForm({});
//       fetchData();
//     } catch (err) {
//       console.error(err);
//     }
//   };

        const handleAdd = async (e) => {
  e.preventDefault();

  try {
    // Safely compute new ID
    const newId =
      data && data.length > 0
        ? Math.max(...data.map((item) => Number(item.id) || 0)) + 1
        : 1;

    // Create new record with proper ID
    const newRecord = { ...form, id: newId };

    await axios.post(`${API_BASE}/${dataset}`, newRecord);

    setForm({});
    fetchData(); // Refresh table
  } catch (err) {
    console.error("Error adding record:", err);
  }
};


  // Delete record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${dataset}/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Employee Data Update</h2>

      {/* Dataset Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Dataset:</label>
        <select
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          className="bg-gray-700 px-3 py-1 rounded"
        >
          {Object.keys(datasetFields).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Form */}
      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3 mb-6">
        {datasetFields[dataset].map((field) => (
          <input
            key={field}
            type={field === "rating" || field === "quantity" || field === "capacity" || field === "used" ? "number" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field] || ""}
            onChange={handleChange}
            className="p-2 bg-gray-800 rounded w-full"
          />
        ))}
        <button
          type="submit"
          className="col-span-2 bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Add Record
        </button>
      </form>

      {/* Data Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-600 text-sm">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-2 border border-gray-600">#</th>
              <th className="p-2 border border-gray-600">Details</th>
              <th className="p-2 border border-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border border-gray-700">
                <td className="p-2">{d.id || i + 1}</td>
                <td className="p-2">{JSON.stringify(d)}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
