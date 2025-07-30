import { useState } from 'react';
import '../styles/Drivers.css';

function Drivers() {
  const [drivers, setDrivers] = useState([
    { id: 1, firstName: 'Jan', lastName: 'Kowalski' },
    { id: 2, firstName: 'Anna', lastName: 'Nowak' },
    { id: 3, firstName: 'Piotr', lastName: 'Zieliński' },
  ]);

  const [newDriver, setNewDriver] = useState({ firstName: '', lastName: '' });
  const [searchFirstName, setSearchFirstName] = useState('');
  const [searchLastName, setSearchLastName] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingDriver, setEditingDriver] = useState(null);

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriver.firstName.trim() || !newDriver.lastName.trim()) return;

    const newId = drivers.length ? Math.max(...drivers.map(d => d.id)) + 1 : 1;
    setDrivers([...drivers, { id: newId, ...newDriver }]);
    setNewDriver({ firstName: '', lastName: '' });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aKey = a[sortConfig.key].toLowerCase();
    const bKey = b[sortConfig.key].toLowerCase();

    if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredDrivers = sortedDrivers.filter(driver =>
    driver.firstName.toLowerCase().includes(searchFirstName.toLowerCase()) &&
    driver.lastName.toLowerCase().includes(searchLastName.toLowerCase())
  );

  const handleDeleteDriver = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego kierowcę?')) {
      setDrivers(drivers.filter(d => d.id !== id));
      if (editingDriver?.id === id) {
        setEditingDriver(null);
      }
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingDriver({ ...editingDriver, [name]: value });
  };

  const handleSaveEdit = () => {
    setDrivers(drivers.map(d => (d.id === editingDriver.id ? editingDriver : d)));
    setEditingDriver(null);
  };

  const handleCancelEdit = () => {
    setEditingDriver(null);
  };

  return (
    <div className="drivers-container">
      <h1>Lista Kierowców</h1>

      <form onSubmit={handleAddDriver} className="add-driver-form">
        <div className="form-row">
          <label>
            Imię:
            <input
              type="text"
              value={newDriver.firstName}
              onChange={e => setNewDriver({ ...newDriver, firstName: e.target.value })}
              placeholder="Wpisz imię"
              required
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              value={newDriver.lastName}
              onChange={e => setNewDriver({ ...newDriver, lastName: e.target.value })}
              placeholder="Wpisz nazwisko"
              required
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
      </form>


      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj po imieniu"
          value={searchFirstName}
          onChange={e => setSearchFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Szukaj po nazwisku"
          value={searchLastName}
          onChange={e => setSearchLastName(e.target.value)}
        />
      </div>

      <table className="drivers-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort('firstName')}
              className={sortConfig.key === 'firstName' ? `sort-${sortConfig.direction}` : ''}
            >
              Imię
            </th>
            <th
              onClick={() => handleSort('lastName')}
              className={sortConfig.key === 'lastName' ? `sort-${sortConfig.direction}` : ''}
            >
              Nazwisko
            </th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.map(driver => (
            <tr key={driver.id}>
              <td>{driver.firstName}</td>
              <td>{driver.lastName}</td>
              <td>
                <button
                  onClick={() => setEditingDriver(driver)}
                  className="edit-button"
                  title="Edytuj kierowcę"
                >
                  Edytuj
                </button>
                <button
                  onClick={(e) => handleDeleteDriver(e, driver.id)}
                  className="delete-button"
                  title="Usuń kierowcę"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {filteredDrivers.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Brak wyników
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingDriver && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Kierowcę</h2>
            <label>
              Imię:
              <input
                type="text"
                name="firstName"
                value={editingDriver.firstName}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                name="lastName"
                value={editingDriver.lastName}
                onChange={handleChangeEditing}
                required
              />
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

export default Drivers;