import { useState } from 'react';
import '../styles/Users.css';
import '../styles/Modals.css';

function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Jan', surname: 'Kowalski', password_hash: 'abc123', role: 'admin' },
    { id: 2, name: 'Anna', surname: 'Nowak', password_hash: 'def456', role: 'user' },
    { id: 3, name: 'Piotr', surname: 'Zieliński', password_hash: 'ghi789', role: 'user' },
  ]);

  const [newUser, setNewUser] = useState({ name: '', surname: '', password_hash: '', role: 'user' });
  const [searchName, setSearchName] = useState('');
  const [searchSurname, setSearchSurname] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'surname', direction: 'asc' });
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.surname.trim() || !newUser.password_hash.trim()) return;

    const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    setUsers([...users, { id: newId, ...newUser }]);
    setNewUser({ name: '', surname: '', password_hash: '', role: 'user' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aKey = a[sortConfig.key].toLowerCase();
    const bKey = b[sortConfig.key].toLowerCase();

    if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchName.toLowerCase()) &&
    user.surname.toLowerCase().includes(searchSurname.toLowerCase()) &&
    (searchRole === '' || user.role === searchRole)
  );

  const handleDeleteUser = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      setUsers(users.filter(u => u.id !== id));
      if (editingUser?.id === id) {
        setEditingUser(null);
      }
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSaveEdit = () => {
    setUsers(users.map(u => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  return (
    <div className="users-container">
      <h1>Lista Użytkowników</h1>

      <form onSubmit={handleAddUser} className="add-user-form">
        <div className="form-row">
          <label>
            Imię:
            <input
              type="text"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Wpisz imię"
              required
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              value={newUser.surname}
              onChange={e => setNewUser({ ...newUser, surname: e.target.value })}
              placeholder="Wpisz nazwisko"
              required
            />
          </label>
          <label>
            Hasło:
            <input
              type="text"
              value={newUser.password_hash}
              onChange={e => setNewUser({ ...newUser, password_hash: e.target.value })}
              placeholder="Wpisz hasło"
              required
            />
          </label>
          <label>
            Rola:
            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
      </form>

      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj po imieniu"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Szukaj po nazwisku"
          value={searchSurname}
          onChange={e => setSearchSurname(e.target.value)}
        />
        <select value={searchRole} onChange={e => setSearchRole(e.target.value)}>
          <option value="">Wszystkie role</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort('name')}
              className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}
            >
              Imię
            </th>
            <th
              onClick={() => handleSort('surname')}
              className={sortConfig.key === 'surname' ? `sort-${sortConfig.direction}` : ''}
            >
              Nazwisko
            </th>
            <th
              onClick={() => handleSort('role')}
              className={sortConfig.key === 'role' ? `sort-${sortConfig.direction}` : ''}
            >
              Rola
            </th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => setEditingUser(user)}
                  className="edit-button"
                  title="Edytuj użytkownika"
                >
                  Edytuj
                </button>
                <button
                  onClick={(e) => handleDeleteUser(e, user.id)}
                  className="delete-button"
                  title="Usuń użytkownika"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Brak wyników
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Użytkownika</h2>
            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={editingUser.name}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={editingUser.surname}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Hasło:
              <input
                type="text"
                name="password_hash"
                value={editingUser.password_hash}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Rola:
              <select
                name="role"
                value={editingUser.role}
                onChange={handleChangeEditing}
                required
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </label>
            <div className="buttons">
              <button onClick={handleSaveEdit}>Zapisz</button>
              <button onClick={handleCancelEdit}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
