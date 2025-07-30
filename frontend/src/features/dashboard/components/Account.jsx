import { useState } from 'react';
import '../styles/Account.css';

function Account() {
  const [account, setAccount] = useState({
    id: 1,
    name: 'Jan',
    surname: 'Kowalski',
    password: ''
  });

  const [editingAccount, setEditingAccount] = useState(null);

  const handleEdit = () => {
    setEditingAccount({ ...account });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAccount(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setAccount({ ...editingAccount, password: '' }); // Nie przechowuj hasła!
    setEditingAccount(null);
    alert('Dane zapisane!');
  };

  const handleCancel = () => {
    setEditingAccount(null);
  };

  return (
    <div className="account-container">
      <h1>Moje Konto</h1>
      <div className="account-details">
        <p><strong>Imię:</strong> {account.name}</p>
        <p><strong>Nazwisko:</strong> {account.surname}</p>
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
                required
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={editingAccount.surname}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Nowe hasło:
              <input
                type="password"
                name="password"
                value={editingAccount.password}
                onChange={handleChange}
                required
              />
            </label>
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
