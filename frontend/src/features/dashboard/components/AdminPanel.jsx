import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/AdminPanel.css';

function AdminPanel() {
  const location = useLocation();
  const isRoot = location.pathname === '/dashboard/admin';

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <h2>Panel administratora</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard/admin/users">Użytkownicy</Link></li>
            <li><Link to="/dashboard/admin/audit-log">Dziennik zdarzeń</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="admin-content">
        {isRoot ? (
          <div>
            <h1>Witamy w panelu administratora!</h1>
            <p>Możesz wykonywać wszystkie operacje, jakie tylko chcesz.
              Po lewej stronie masz panel do zarządzania użytkownikami oraz dziennik zdarzeń.
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
