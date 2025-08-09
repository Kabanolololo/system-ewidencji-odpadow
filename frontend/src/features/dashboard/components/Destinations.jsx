import { useState, useEffect } from 'react';
import { fetchAllDestinationsWithStoredToken, createNewDestination, updateDestinationById, deleteDestinationById } from '../../../api/Destinations';
import '../styles/Destinations.css';
import '../styles/Modals.css';

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  
  // Stan dla nowej destynacji
  const [newDestination, setNewDestination] = useState({
    country: '',
    voivodeship: '',
    city: '',
    postal_code: '',
    address: ''
  });

  // Stan dla wyszukiwania i sortowania
  const [search, setSearch] = useState({
    country: '',
    voivodeship: '',
    city: '',
    postal_code: '',
    address: ''
  });

  // Stan dla sortowania
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [editingDestination, setEditingDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ładowanie destynacji przy pierwszym renderowaniu i przy zmianie wyszukiwania lub sortowania
  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchAllDestinationsWithStoredToken({
          ...search,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
        });
        setDestinations(data);
      } catch (err) {
        console.error('Błąd podczas pobierania destynacji:', err.message);
        setError(err.message);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [search, sortConfig]);

  // Dodawanie nowej destynacji
  const handleAddDestination = async (e) => {
    e.preventDefault();
    setError('');

    // Walidacja wymaganych pól
    if (
      !newDestination.country.trim() ||
      !newDestination.city.trim() ||
      !newDestination.postal_code.trim() ||
      !newDestination.address.trim()
    ) {
      setError('Wszystkie wymagane pola muszą być wypełnione.');
      return;
    }

    try {
      const createdDestination = await createNewDestination({
        country: newDestination.country.trim(),
        voivodeship: newDestination.voivodeship.trim(),
        city: newDestination.city.trim(),
        postal_code: newDestination.postal_code.trim(),
        address: newDestination.address.trim(),
      });

      setDestinations([...destinations, createdDestination]);

      setNewDestination({
        country: '',
        voivodeship: '',
        city: '',
        postal_code: '',
        address: '',
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Błąd podczas dodawania destynacji');
    }
  };

  // Funkcja do sortowania
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Funkcja do usuwania destynacji
  const handleDeleteDestination = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tę destynację?')) {
      try {
        await deleteDestinationById(id);
        setDestinations(destinations.filter(d => d.id !== id));
        if (editingDestination?.id === id) {
          setEditingDestination(null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Błąd podczas usuwania destynacji');
      }
    }
  };

  // Funkcje do edycji destynacji
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingDestination({ ...editingDestination, [name]: value });
  };

  // Zapisanie edytowanej destynacji
  const handleSaveEdit = async () => {
    setError('');
    try {
      const updatedDestination = await updateDestinationById(editingDestination.id, {
        country: editingDestination.country.trim(),
        voivodeship: editingDestination.voivodeship.trim(),
        city: editingDestination.city.trim(),
        postal_code: editingDestination.postal_code.trim(),
        address: editingDestination.address.trim(),
      });

      setDestinations(destinations.map(d => (d.id === updatedDestination.id ? updatedDestination : d)));

      setEditingDestination(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Błąd podczas aktualizacji destynacji');
    }
  };

  // Anulowanie edycji destynacji
  const handleCancelEdit = () => {
    setEditingDestination(null);
  };

  return (
    <div className="drivers-container">
      <h1>Lista Destynacji</h1>

      {/* Formularz do dodawania nowej destynacji */}
      <form onSubmit={handleAddDestination} className="add-driver-form">
      <div className="form-row">
        <label>Kraj:
          <input
            type="text"
            value={newDestination.country}
            onChange={e => setNewDestination({ ...newDestination, country: e.target.value })}
            placeholder="Wpisz kraj"
            required
            title="Wpisz tylko litery"
          />
        </label>
        <label>Województwo:
          <input
            type="text"
            value={newDestination.voivodeship}
            onChange={e => setNewDestination({ ...newDestination, voivodeship: e.target.value })}
            placeholder="Wpisz województwo"
            title="Wpisz tylko litery"
          />
        </label>
        <label>Miasto:
          <input
            type="text"
            value={newDestination.city}
            onChange={e => setNewDestination({ ...newDestination, city: e.target.value })}
            placeholder="Wpisz miasto"
            required
            title="Wpisz tylko litery"
          />
        </label>
        <label>Kod pocztowy:
          <input
            type="text"
            value={newDestination.postal_code}
            onChange={e => setNewDestination({ ...newDestination, postal_code: e.target.value })}
            placeholder="Wpisz kod pocztowy"
            required
            title="Wpisz cyfry, spacje lub myślniki"
          />
        </label>
        <label>Adres:
          <input
            type="text"
            value={newDestination.address}
            onChange={e => setNewDestination({ ...newDestination, address: e.target.value })}
            placeholder="Wpisz adres"
            required
          />
        </label>
      </div>
      <button type="submit" className="add-button">Dodaj</button>
    </form>

      {/* Wyszukiwanie i sortowanie */}
      <h2 className='filters-sorting'>Filtry i wyszukiwanie</h2>
      <div className="search-inputs">
        <input type="text" placeholder="Szukaj kraj" value={search.country} onChange={e => setSearch({ ...search, country: e.target.value })} />
        <input type="text" placeholder="Szukaj województwo" value={search.voivodeship} onChange={e => setSearch({ ...search, voivodeship: e.target.value })} />
        <input type="text" placeholder="Szukaj miasto" value={search.city} onChange={e => setSearch({ ...search, city: e.target.value })} />
        <input type="text" placeholder="Szukaj kod pocztowy" value={search.postal_code} onChange={e => setSearch({ ...search, postal_code: e.target.value })} />
        <input type="text" placeholder="Szukaj adres" value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
      </div>

      {/* Tabela z destynacjami */}
      <div style={{ position: 'relative' }}>
        {destinations.length > 0 ? (
          <table className="destinations-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('country')} className={sortConfig.key === 'country' ? `sort-${sortConfig.direction}` : ''}>Kraj</th>
                <th onClick={() => handleSort('voivodeship')} className={sortConfig.key === 'voivodeship' ? `sort-${sortConfig.direction}` : ''}>Województwo</th>
                <th onClick={() => handleSort('city')} className={sortConfig.key === 'city' ? `sort-${sortConfig.direction}` : ''}>Miasto</th>
                <th onClick={() => handleSort('postal_code')} className={sortConfig.key === 'postal_code' ? `sort-${sortConfig.direction}` : ''}>Kod pocztowy</th>
                <th onClick={() => handleSort('address')} className={sortConfig.key === 'address' ? `sort-${sortConfig.direction}` : ''}>Adres</th>
                <th className='dont-sort'>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map(dest => (
                <tr key={dest.id}>
                  <td>{dest.country}</td>
                  <td>{dest.voivodeship}</td>
                  <td>{dest.city}</td>
                  <td>{dest.postal_code}</td>
                  <td>{dest.address}</td>
                  <td>
                    <button onClick={() => setEditingDestination(dest)} className="edit-button">Edytuj</button>
                    <button onClick={(e) => handleDeleteDestination(e, dest.id)} className="delete-button">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !loading && !error ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}></p>
        ) : null}

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Wczytywanie destynacji...</p>}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Panel edycji destynacji */}
      {editingDestination && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Destynację</h2>
            <label>Country:
              <input type="text" name="country" value={editingDestination.country} onChange={handleChangeEditing} required />
            </label>
            <label>Voivodeship:
              <input type="text" name="voivodeship" value={editingDestination.voivodeship} onChange={handleChangeEditing} />
            </label>
            <label>City:
              <input type="text" name="city" value={editingDestination.city} onChange={handleChangeEditing} required />
            </label>
            <label>Postal Code:
              <input type="text" name="postal_code" value={editingDestination.postal_code} onChange={handleChangeEditing} required />
            </label>
            <label>Address:
              <input type="text" name="address" value={editingDestination.address} onChange={handleChangeEditing} required />
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