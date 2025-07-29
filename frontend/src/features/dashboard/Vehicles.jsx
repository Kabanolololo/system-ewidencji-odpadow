import { useState } from 'react';
import './styles/Vehicles.css';

function Vehicles() {
  const [vehicles, setVehicles] = useState([
    { id: 1, registration: 'ABC123', make: 'Toyota', model: 'Corolla' },
    { id: 2, registration: 'XYZ789', make: 'Ford', model: 'Focus' },
    { id: 3, registration: 'DEF456', make: 'Honda', model: 'Civic' },
  ]);

  const [newVehicle, setNewVehicle] = useState({ registration: '', make: '', model: '' });
  const [searchRegistration, setSearchRegistration] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.registration.trim() || !newVehicle.make.trim() || !newVehicle.model.trim()) return;

    const newId = vehicles.length ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;
    setVehicles([...vehicles, { id: newId, ...newVehicle }]);
    setNewVehicle({ registration: '', make: '', model: '' });
  };

  const handleSort = () => {
    let direction = 'asc';
    if (sortConfig.key === 'registration' && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: 'registration', direction });
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aKey = a.registration.toLowerCase();
    const bKey = b.registration.toLowerCase();

    if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter(vehicle =>
    vehicle.registration.toLowerCase().includes(searchRegistration.toLowerCase())
  );

  const handleDeleteVehicle = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
      if (editingVehicle?.id === id) {
        setEditingVehicle(null);
      }
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingVehicle({ ...editingVehicle, [name]: value });
  };

  const handleSaveEdit = () => {
    setVehicles(vehicles.map(v => (v.id === editingVehicle.id ? editingVehicle : v)));
    setEditingVehicle(null);
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
  };

  return (
    <div className="vehicles-container">
      <h1>Lista Pojazdów</h1>

      <form onSubmit={handleAddVehicle} className="add-vehicle-form">
        <div className="form-row">
          <label>
            Numer rejestracyjny:
            <input
              type="text"
              value={newVehicle.registration}
              onChange={e => setNewVehicle({ ...newVehicle, registration: e.target.value })}
              placeholder="Wpisz numer rejestracyjny"
              required
            />
          </label>
          <label>
            Marka:
            <input
              type="text"
              value={newVehicle.make}
              onChange={e => setNewVehicle({ ...newVehicle, make: e.target.value })}
              placeholder="Wpisz markę"
              required
            />
          </label>
          <label>
            Model:
            <input
              type="text"
              value={newVehicle.model}
              onChange={e => setNewVehicle({ ...newVehicle, model: e.target.value })}
              placeholder="Wpisz model"
              required
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
      </form>

      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj po rejestracji"
          value={searchRegistration}
          onChange={e => setSearchRegistration(e.target.value)}
        />
      </div>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th
              onClick={handleSort}
              className={sortConfig.key === 'registration' ? `sort-${sortConfig.direction}` : ''}
            >
              Numer rejestracyjny
            </th>
            <th>Marka</th>
            <th>Model</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map(vehicle => (
            <tr key={vehicle.id}>
              <td>{vehicle.registration}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>
                <button
                  onClick={() => setEditingVehicle(vehicle)}
                  className="edit-button"
                  title="Edytuj pojazd"
                >
                  Edytuj
                </button>
                <button
                  onClick={(e) => handleDeleteVehicle(e, vehicle.id)}
                  className="delete-button"
                  title="Usuń pojazd"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {filteredVehicles.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Brak wyników
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingVehicle && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Pojazd</h2>
            <label>
              Numer rejestracyjny:
              <input
                type="text"
                name="registration"
                value={editingVehicle.registration}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Marka:
              <input
                type="text"
                name="make"
                value={editingVehicle.make}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Model:
              <input
                type="text"
                name="model"
                value={editingVehicle.model}
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

export default Vehicles;