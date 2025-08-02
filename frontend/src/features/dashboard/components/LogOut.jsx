import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogOut({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    onLogout();
    navigate('/', { replace: true });
  }, [navigate, onLogout]);

  return (
    <div>
      <p>Wylogowywanie...</p>
    </div>
  );
}

export default LogOut;
