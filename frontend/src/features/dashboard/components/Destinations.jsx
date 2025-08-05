import { useState } from 'react';
import '../styles/Destinations.css';
import '../styles/Modals.css';

function Destinations() {
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      country: 'Polska',
      voivodeship: 'Łódzkie',
      city: 'Wieluń',
      postal_code: '98-300',
      address: '18-go stycznia 30'
    },
    {
      id: 2,
      country: 'Polska',
      voivodeship: 'Mazowieckie',
      city: 'Warszawa',
      postal_code: '00-001',
      address: 'Aleje Jerozolimskie 1'
    }
  ]);

  const [newDestination, setNewDestination] = useState({
    country: '',
    voivodeship: '',
    city: '',
    postal_code: '',
    address: ''
  });

  const [search, setSearch] = useState({
    country: '',
    voivodeship: '',
    city: '',
    postal_code: '',
    address: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingDestination, setEditingDestination] = useState(null);

  const handleAddDestination = (e) => {
    e.preventDefault();
    const newId = destinations.length ? Math.max(...destinations.map(d => d.id)) + 1 : 1;
    setDestinations([...destinations, { id: newId, ...newDestination }]);
    setNewDestination({
      country: '',
      voivodeship: '',
      city: '',
      postal_code: '',
      address: ''
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDestinations = [...destinations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aKey = a[sortConfig.key]?.toLowerCase() || '';
    const bKey = b[sortConfig.key]?.toLowerCase() || '';

    if (aKey < bKey) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredDestinations = sortedDestinations.filter(dest =>
    dest.country.toLowerCase().includes(search.country.toLowerCase()) &&
    dest.voivodeship.toLowerCase().includes(search.voivodeship.toLowerCase()) &&
    dest.city.toLowerCase().includes(search.city.toLowerCase()) &&
    dest.postal_code.toLowerCase().includes(search.postal_code.toLowerCase()) &&
    dest.address.toLowerCase().includes(search.address.toLowerCase())
  );

  const handleDeleteDestination = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę destynację?')) {
      setDestinations(destinations.filter(d => d.id !== id));
      if (editingDestination?.id === id) {
        setEditingDestination(null);
      }
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingDestination({ ...editingDestination, [name]: value });
  };

  const handleSaveEdit = () => {
    setDestinations(destinations.map(d => (d.id === editingDestination.id ? editingDestination : d)));
    setEditingDestination(null);
  };

  const handleCancelEdit = () => {
    setEditingDestination(null);
  };

  return (
    <div className="drivers-container">
      <h1>Lista Destynacji</h1>

      <form onSubmit={handleAddDestination} className="add-driver-form">
        <div className="form-row">
          <label>
            Kraj:
            <input
              type="text"
              placeholder="Wpisz kraj"
              value={newDestination.country}
              onChange={e => setNewDestination({ ...newDestination, country: e.target.value })}
              required
            />
          </label>
          <label>
            Województwo:
            <input
              type="text"
              placeholder="Wpisz województwo"
              value={newDestination.voivodeship}
              onChange={e => setNewDestination({ ...newDestination, voivodeship: e.target.value })}
            />
          </label>
          <label>
            Miasto:
            <input
              type="text"
              placeholder='Wpisz miasto'
              value={newDestination.city}
              onChange={e => setNewDestination({ ...newDestination, city: e.target.value })}
              required
            />
          </label>
          <label>
            Kod pocztowy:
            <input
              type="text"
              placeholder="Wpisz kod pocztowy"
              value={newDestination.postal_code}
              onChange={e => setNewDestination({ ...newDestination, postal_code: e.target.value })}
              required
            />
          </label>
          <label>
            Adres:
            <input
              type="text"
              placeholder='Wpisz adres'
              value={newDestination.address}
              onChange={e => setNewDestination({ ...newDestination, address: e.target.value })}
              required
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
      </form>

      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj kraj"
          value={search.country}
          onChange={e => setSearch({ ...search, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj województwo"
          value={search.voivodeship}
          onChange={e => setSearch({ ...search, voivodeship: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj miasto"
          value={search.city}
          onChange={e => setSearch({ ...search, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj kod pocztowy"
          value={search.postal_code}
          onChange={e => setSearch({ ...search, postal_code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj adres"
          value={search.address}
          onChange={e => setSearch({ ...search, address: e.target.value })}
        />
      </div>

      <table className="destinations-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('country')} className={sortConfig.key === 'country' ? `sort-${sortConfig.direction}` : ''}>Kraj</th>
            <th onClick={() => handleSort('voivodeship')} className={sortConfig.key === 'voivodeship' ? `sort-${sortConfig.direction}` : ''}>Województwo</th>
            <th onClick={() => handleSort('city')} className={sortConfig.key === 'city' ? `sort-${sortConfig.direction}` : ''}>Miasto</th>
            <th onClick={() => handleSort('postal_code')} className={sortConfig.key === 'postal_code' ? `sort-${sortConfig.direction}` : ''}>Kod pocztowy</th>
            <th onClick={() => handleSort('address')} className={sortConfig.key === 'address' ? `sort-${sortConfig.direction}` : ''}>Adres</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {filteredDestinations.map(dest => (
            <tr key={dest.id}>
              <td>{dest.country}</td>
              <td>{dest.voivodeship}</td>
              <td>{dest.city}</td>
              <td>{dest.postal_code}</td>
              <td>{dest.address}</td>
              <td>
                <button
                  onClick={() => setEditingDestination(dest)}
                  className="edit-button"
                  title="Edytuj"
                >
                  Edytuj
                </button>
                <button
                  onClick={(e) => handleDeleteDestination(e, dest.id)}
                  className="delete-button"
                  title="Usuń"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
          {filteredDestinations.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Brak wyników
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingDestination && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Destynację</h2>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={editingDestination.country}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Voivodeship:
              <input
                type="text"
                name="voivodeship"
                value={editingDestination.voivodeship}
                onChange={handleChangeEditing}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={editingDestination.city}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Postal Code:
              <input
                type="text"
                name="postal_code"
                value={editingDestination.postal_code}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={editingDestination.address}
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

export default Destinations;
