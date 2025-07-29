import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/Navbar.css';

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Jeśli przewinięto więcej niż 0 px w pionie, navbar jest sticky
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    // cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="navbar-logo">Ewidencja Odpadów</div>
      <ul className="navbar-links">
        <li><NavLink to="admin" className={({ isActive }) => isActive ? 'active' : ''}>Panel Admina</NavLink></li>
        <li><NavLink to="drivers" className={({ isActive }) => isActive ? 'active' : ''}>Kierowcy</NavLink></li>
        <li><NavLink to="vehicles" className={({ isActive }) => isActive ? 'active' : ''}>Pojazdy</NavLink></li>
        <li><NavLink to="destinations" className={({ isActive }) => isActive ? 'active' : ''}>Destynacje</NavLink></li>
        <li><NavLink to="contractors" className={({ isActive }) => isActive ? 'active' : ''}>Kontrahenci</NavLink></li>
        <li><NavLink to="waste" className={({ isActive }) => isActive ? 'active' : ''}>Odpady</NavLink></li>
        <li><NavLink to="records" className={({ isActive }) => isActive ? 'active' : ''}>Ewidencja</NavLink></li>
        <li><NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''}>Raporty</NavLink></li>
        <li><NavLink to="account" className={({ isActive }) => isActive ? 'active' : ''}>Edytuj Konto</NavLink></li>
        <li><NavLink to="logout" className={({ isActive }) => isActive ? 'active' : ''}>Wyloguj</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
