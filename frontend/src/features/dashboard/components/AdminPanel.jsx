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
            <p>
              W tym miejscu możesz zarządzać systemem oraz sprawdzać historię wszystkich operacji.
              Panel po lewej stronie pozwala Ci na szybki dostęp do dwóch głównych sekcji:
            </p>
            <h2>Zakładka „Użytkownicy”</h2>
            <p>
              Tutaj znajdziesz listę wszystkich zarejestrowanych użytkowników.
              Możesz dodawać nowych użytkowników, edytować istniejące dane, a także usuwać użytkowników z systemu.
              Każda z tych operacji jest rejestrowana w dzienniku zdarzeń.
            </p>
            <h2>Zakładka „Dziennik zdarzeń”</h2>
            <p>
              Ta sekcja zawiera pełną historię wszystkich działań wykonanych w systemie.
              Znajdziesz tu logi dotyczące dodawania, edytowania i usuwania użytkowników.
              Każdy wpis w dzienniku przechowuje:
            </p>
            <ul>
              <li>rodzaj operacji (np. dodanie, edycja, usunięcie),</li>
              <li>czas, w którym operacja została wykonana,</li>
              <li>użytkownika, który ją wykonał,</li>
              <li>stare dane oraz nowe dane w formacie JSON.</li>
            </ul>
            <p>
              Dzięki temu możesz w każdej chwili sprawdzić, kto i kiedy zmienił konkretne informacje.
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
