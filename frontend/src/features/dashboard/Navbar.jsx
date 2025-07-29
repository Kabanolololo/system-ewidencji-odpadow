import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './styles/Navbar.css';

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="navbar-top">
        <div className="navbar-logo">Ewidencja Odpadów</div>
        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><NavLink to="admin" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Panel Admina</NavLink></li>
        <li><NavLink to="drivers" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Kierowcy</NavLink></li>
        <li><NavLink to="vehicles" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Pojazdy</NavLink></li>
        <li><NavLink to="destinations" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Destynacje</NavLink></li>
        <li><NavLink to="contractors" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Kontrahenci</NavLink></li>
        <li><NavLink to="waste" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Odpady</NavLink></li>
        <li><NavLink to="records" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Ewidencja</NavLink></li>
        <li><NavLink to="reports" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Raporty</NavLink></li>
        <li><NavLink to="account" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Edytuj Konto</NavLink></li>
        <li><NavLink to="logout" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Wyloguj</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
