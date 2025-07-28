import { NavLink } from 'react-router-dom';
import './styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Ewidencja Odpadów</div>
      <ul className="navbar-links">
        <li><NavLink to="admin" className={({ isActive }) => isActive ? 'active' : ''}>Panel Admina</NavLink></li>
        <li><NavLink to="drivers" className={({ isActive }) => isActive ? 'active' : ''}>Kierowcy</NavLink></li>
        <li><NavLink to="vehicles" className={({ isActive }) => isActive ? 'active' : ''}>Pojazdy</NavLink></li>
        <li><NavLink to="destinations" className={({ isActive }) => isActive ? 'active' : ''}>Destynacje</NavLink></li>
        <li><NavLink to="contractors" className={({ isActive }) => isActive ? 'active' : ''}>Kontrahenci</NavLink></li>
        <li><NavLink to="waste" className={({ isActive }) => isActive ? 'active' : ''}>Odpady</NavLink></li>
        <li><NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>Raporty</NavLink></li>
        <li><NavLink to="account" className={({ isActive }) => isActive ? 'active' : ''}>Edytuj Konto</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
