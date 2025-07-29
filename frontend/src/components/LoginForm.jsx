import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    alert(`Zalogowano jako: ${username}`);
    onLogin();
    navigate('/dashboard');
  };

  const handleInfoClick = (message) => {
    alert(message);
  };

  return (
    <main className="login-main">
      <div className="login-container">
        <h1>🗑️ System Ewidencji Odpadów</h1>
        <p>Zaloguj się, aby kontynuować</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Logowanie</h2>

          <label htmlFor="username">Nazwa użytkownika</label>
          <input
            id="username"
            type="text"
            placeholder="np. akowalski"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Hasło</label>
          <input
            id="password"
            type="password"
            placeholder="Twoje hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Zaloguj się</button>

          <div className="login-links">
            <span onClick={() => handleInfoClick('Skontaktuj się z administratorem.')}>Nie masz konta?</span>
            <span onClick={() => handleInfoClick('Skontaktuj się z administratorem.')}>Zapomniałeś hasła?</span>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginForm;
