import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    alert(`Zalogowano jako: ${username}`);
    
    // Tutaj zrobić walidację, potem nawigujesz:
    navigate('/dashboard');
  };

  const handleInfoClick = (message) => {
    alert(message);
  };

  return (
    <div className="login-container">
      <h1>Witamy w systemie zarządzania ewidencją odpadów</h1>
      <p>Prosimy się zalogować na swoje konto</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Zaloguj się</h2>
        <input
          type="text"
          placeholder="akowalski"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Zaloguj</button>
        <div className="login-links">
          <span onClick={() => handleInfoClick('Skontaktuj się z administratorem.')}>Nie masz konta?</span>
          <span onClick={() => handleInfoClick('Skontaktuj się z administratorem.')}>Zapomniałeś hasła?</span>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
