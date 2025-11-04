const analyticsData = {
  inventory: [
    { item: "Laptops", quantity: 120, reorderLevel: 30, unitPrice: 55000 },
    { item: "Monitors", quantity: 80, reorderLevel: 20, unitPrice: 12000 },
    { item: "Keyboards", quantity: 150, reorderLevel: 40, unitPrice: 1500 },
    { item: "Mice", quantity: 200, reorderLevel: 50, unitPrice: 800 },
    { item: "Printers", quantity: 60, reorderLevel: 15, unitPrice: 18000 },
  ],

  suppliers: [
    { name: "TechSupply Co.", rating: 4.8, deliveries: 200, region: "Bangalore", contact: "+91 98765 43210" },
    { name: "OfficeHub", rating: 4.2, deliveries: 150, region: "Mumbai", contact: "+91 98760 12345" },
    { name: "DigitalParts Ltd.", rating: 4.6, deliveries: 180, region: "Delhi", contact: "+91 98123 45678" },
    { name: "GadgetWorld", rating: 4.4, deliveries: 130, region: "Hyderabad", contact: "+91 99999 88888" },
    { name: "MandalElectronics", rating: 4.9, deliveries: 530, region: "Kolkata", contact: "+91 99999 88888" },
    { name: "TheCompuster", rating: 4.3, deliveries: 330, region: "Chennai", contact: "+91 99999 88888" },
  ],

  revenue: [
    { month: "Jan", sales: 5000, profit: 4200 },
    { month: "Feb", sales: 7000, profit: 5000 },
    { month: "Mar", sales: 8000, profit: 3500 },
    { month: "Apr", sales: 9000, profit: 7000 },
    { month: "May", sales: 4000, profit: 3000 },
    { month: "Jun", sales: 10000, profit: 6500 },
    { month: "Jul", sales: 9500, profit: 3200 },
    { month: "Aug", sales: 10000, profit: 5200 },
    { month: "Sep", sales: 6000, profit: 3200 },
    { month: "Oct", sales: 15000, profit: 6200 },
  ],

  orders: [
    { id: 101, customer: "ABC Pvt Ltd", item: "Laptops", quantity: 20, status: "Delivered", date: "2025-10-21" },
    { id: 102, customer: "TechieZone", item: "Monitors", quantity: 15, status: "Pending", date: "2025-10-25" },
    { id: 103, customer: "GlobalCorp", item: "Printers", quantity: 10, status: "Shipped", date: "2025-10-29" },
    { id: 104, customer: "CodeWorks", item: "Keyboards", quantity: 40, status: "Delivered", date: "2025-10-30" },
  ],

  employees: [
    { name: "Amit Kumar", department: "Procurement", performance: 88, efficiency: 92 },
    { name: "Priya Sharma", department: "Warehouse", performance: 90, efficiency: 89 },
    { name: "Ravi Singh", department: "Sales", performance: 95, efficiency: 91 },
    { name: "Sneha Das", department: "Inventory", performance: 87, efficiency: 85 },
  ],

  warehouses: [
    { location: "Bangalore", capacity: 10000, used: 7500 },
    { location: "Mumbai", capacity: 8000, used: 6000 },
    { location: "Kolkata", capacity: 22000, used: 9000 },
    { location: "Pune", capacity: 13000, used: 9000 },
    { location: "Gurgaon", capacity: 16000, used: 9000 },
    { location: "Noida", capacity: 9000, used: 9000 },
  ],

  expenses: [
    { month: "Jan", logistics: 1500, maintenance: 700, salaries: 3000 },
    { month: "Feb", logistics: 1600, maintenance: 800, salaries: 3200 },
    { month: "Mar", logistics: 1700, maintenance: 850, salaries: 3300 },
    { month: "Apr", logistics: 1800, maintenance: 900, salaries: 3400 },
    { month: "May", logistics: 2000, maintenance: 950, salaries: 3500 },
  ],
};

export default analyticsData;
