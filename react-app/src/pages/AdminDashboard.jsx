import React from 'react'
import Navbar from '../components/Navbar'
import { Routes, Route, Router } from 'react-router-dom'
import Dashboard from './Dashboard'
import Inventory from './Inventory'
import Suppliers from './/Suppliers'
import Analytics from './Analytics'
import Reports from './Reports'
import Warehouses from './Warehouses'
import Summarize from './Summarize'


const AdminDashboard = () => {
  return (

    
    <div>
          <Navbar />
       

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/summarize" element={<Summarize />} />
        </Routes>
    </div>
  )
}

export default AdminDashboard
