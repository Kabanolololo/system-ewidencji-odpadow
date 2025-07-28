import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import './styles/Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
