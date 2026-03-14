// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Left Sidebar Navigation */}
        <nav style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px' }}>
          <h2>CoreInventory</h2>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '30px' }}>
            <li style={{ marginBottom: '15px' }}><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>📦 Products</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/receipts" style={{ color: 'white', textDecoration: 'none' }}>📥 Receipts (In)</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/deliveries" style={{ color: 'white', textDecoration: 'none' }}>📤 Deliveries (Out)</Link></li>
            <li style={{ marginBottom: '15px' }}><Link to="/ledger" style={{ color: 'white', textDecoration: 'none' }}>📖 Move History</Link></li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px', background: '#ecf0f1' }}>
          <Routes>
            <Route path="/" element={<h1>Dashboard: Inventory Overview</h1>} />
            <Route path="/products" element={<h1>Product Management</h1>} />
            <Route path="/receipts" element={<h1>Incoming Stock Operations</h1>} />
            <Route path="/deliveries" element={<h1>Outgoing Stock Operations</h1>} />
            <Route path="/ledger" element={<h1>The Stock Ledger</h1>} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
// Run this using: npm run dev