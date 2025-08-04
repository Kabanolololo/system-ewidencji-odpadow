import { useState, useEffect } from 'react';
import { fetchAllUsersWithStoredToken, createNewUser ,updateUserById, deleteUserById } from '../../../api/Users'; // <-- DODANE
import '../styles/Users.css';
import '../styles/Modals.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stany dla formularza dodawania użytkownika
  const [newUser, setNewUser] = useState({ name: '', surname: '', password_hash: 'Pa$$w0rd', role: 'user' });

  // Stany dla filtrów i sortowania
  const [searchName, setSearchName] = useState('');
  const [searchSurname, setSearchSurname] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [addError, setAddError] = useState('');

  // Ładowanie użytkowników przy pierwszym renderze i przy zmianie filtrów
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllUsersWithStoredToken({
          name: searchName,
          surname: searchSurname,
          role: searchRole,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
        });
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Błąd podczas pobierania użytkowników");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [searchName, searchSurname, searchRole, sortConfig]);

  // Funkcja do dodawania nowego użytkownika
  const handleAddUser = async (e) => {
  e.preventDefault();
  setAddError('');

  if (!newUser.name.trim() || !newUser.surname.trim() || !newUser.password_hash.trim()) {
    setAddError('Wszystkie pola są wymagane.');
    return;
  }

  try {
    const createdUser = await createNewUser(newUser);
    setUsers([...users, createdUser]);
    setNewUser({ name: '', surname: '', password_hash: '', role: 'user' });
  } catch (err) {
    console.error(err);
    setAddError(err.message || "Błąd podczas tworzenia użytkownika");
    }
  };

  // Funkcje do sortowania
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Funkcja do usuwania użytkownika
  const handleDeleteUser = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      try {
        await deleteUserById(id);
        setUsers(users.filter(u => u.id !== id));
        if (editingUser?.id === id) {
          setEditingUser(null);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Błąd podczas usuwania użytkownika");
      }
    }
  };

  // Funkcje do edycji użytkownika
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // Funkcja do zapisywania zmian w edycji użytkownika
  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const updatedUser = await updateUserById(editingUser.id, {
        name: editingUser.name,
        surname: editingUser.surname,
        password_hash: editingUser.password_hash,
        role: editingUser.role,
      });

      setUsers(users.map(u => (u.id === updatedUser.id ? updatedUser : u)));
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setSaveError(err.message || "Błąd podczas zapisywania zmian");
    } finally {
      setSaving(false);
    }
  };

  // Funkcja do anulowania edycji
  const handleCancelEdit = () => {
    setEditingUser(null);
    setSaveError('');
  };

  return (
    <div className="users-container">
      <h1>Lista Użytkowników</h1>

      {/* Formularz dodawania nowego użytkownika */}
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
            Hasło (domyślne):
            <input
              type="text"
              value={newUser.password_hash}
              readOnly
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
        {addError && <p className="error">{addError}</p>}
        <p className="info">
          Hasło domyślne: <strong>Pa$$w0rd</strong>. Użytkownik powinien od razu je zmienić po pierwszym logowaniu.
        </p>
      </form>

      {/* --- Filtry i wyszukiwanie --- */}
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

      {error && <p className="error">{error}</p>}

      {/* --- Lista użytkowników --- */}
      <div style={{ position: 'relative' }}>
        {users.length > 0 ? (
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
                <th>
                  Rola
                </th>
                <th>
                  Username
                </th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.role}</td>
                  <td>{user.username || '-'}</td>
                  <td>
                    <button onClick={() => setEditingUser(user)} className="edit-button">
                      Edytuj
                    </button>
                    <button onClick={(e) => handleDeleteUser(e, user.id)} className="delete-button">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && (
            <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
              Brak wyników.
            </p>
          )
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* --- Edycja użytkownika --- */}
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

            {saveError && <p className='error'>{saveError}</p>}
            {saving && <p className='loading'>Zapisywanie zmian...</p>}

            <div className="buttons">
              <button onClick={handleSaveEdit} disabled={saving}>Zapisz</button>
              <button onClick={handleCancelEdit} disabled={saving}>Anuluj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;