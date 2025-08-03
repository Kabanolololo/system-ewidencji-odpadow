import { useState, useEffect } from 'react';
import '../styles/Account.css';
import '../styles/Modals.css';
import '../styles/Buttons.css';
import { fetchUserByIdWithStoredToken, updateUserByIdWithStoredToken } from '../../../api/Account';

function Account() {
  const [account, setAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const userId = localStorage.getItem("user_id");

  // Pobieranie danych użytkownika przy załadowaniu komponentu
  useEffect(() => {

    // Funkcja do pobierania danych użytkownika
    async function loadAccount() {
      try {
        const data = await fetchUserByIdWithStoredToken(userId);
        setAccount({ ...data, password: '' });
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
    loadAccount();
  }, [userId]);

  // Funkcje do obsługi edycji konta
  const handleEdit = () => {
    setEditingAccount({
      name: account.name,
      surname: account.surname,
      password: '',
      confirmPassword: ''
    });
    setSaveError(null);
  };

  // Funkcje do obsługi zmian w formularzu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funkcje do obsługi zapisywania i anulowania zmian
  const handleSave = async () => {
  if (editingAccount.password !== editingAccount.confirmPassword) {
    setSaveError('Hasła muszą być takie same.');
    return;
  }

  const updatedData = {
    name: editingAccount.name,
    surname: editingAccount.surname,
  };

  if (editingAccount.password) {
    updatedData.password_hash = editingAccount.password;
  }

  try {
    await updateUserByIdWithStoredToken(userId, updatedData);

    setAccount(prev => ({
      ...prev,
      name: editingAccount.name,
      surname: editingAccount.surname,
      password: '',
    }));

    setEditingAccount(null);
    setSaveError(null);

    alert('Dane zapisane!');
  } catch (err) {
    setSaveError(err.message || 'Błąd podczas zapisywania.');
  }
  };

  const handleCancel = () => {
    setEditingAccount(null);
    setSaveError(null);
  };

  if (error) return <p className="error">{error}</p>;
  if (!account) return <p className='loading'>Ładowanie danych...</p>;

  return (
    <div className="account-container">
      <h1>Moje Konto</h1>

      <div className="account-details">
        <p><strong>Imię:</strong> {account.name}</p>
        <p><strong>Nazwisko:</strong> {account.surname}</p>
        <p><strong>Nazwa użytkownika:</strong> {account.username}</p>
        <button className="edit-button" onClick={handleEdit}>Edytuj Dane</button>
      </div>

      {editingAccount && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancel}>×</button>
            <h2>Edytuj Konto</h2>

            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={editingAccount.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={editingAccount.surname}
                onChange={handleChange}
              />
            </label>

            <label>
              Nazwa użytkownika:
              <input
                type="text"
                name="username"
                value={account.username}
                readOnly
              />
            </label>

            <label>
              Nowe hasło:
              <input
                type="password"
                name="password"
                value={editingAccount.password || ''}
                onChange={handleChange}
              />
            </label>

            <label>
              Powtórz nowe hasło:
              <input
                type="password"
                name="confirmPassword"
                value={editingAccount.confirmPassword || ''}
                onChange={handleChange}
              />
            </label>

            {saveError && <p className="error">{saveError}</p>}

            <div className="buttons">
              <button onClick={handleSave}>Zapisz</button>
              <button onClick={handleCancel}>Anuluj</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Account;