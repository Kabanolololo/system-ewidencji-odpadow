import { useState, useEffect } from 'react';
import { fetchAllDriversWithStoredToken, createNewDriver, updateDriverById, deleteDriverById } from '../../../api/Drivers';
import '../styles/Drivers.css';
import '../styles/Modals.css';

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stan do dodawania nowego kierowcy
  const [newDriver, setNewDriver] = useState({ name: '', surname: '' });
  const [addError, setAddError] = useState('');

  // Stany do wyszukiwania i sortowania
  const [searchName, setSearchName] = useState('');
  const [searchSurname, setSearchSurname] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Stan do edycji kierowcy
  const [editingDriver, setEditingDriver] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Ładowanie kierowców z backendu
  useEffect(() => {
    async function loadDrivers() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllDriversWithStoredToken({
          name: searchName,
          surname: searchSurname,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
        });
        setDrivers(data);
      } catch (err) {
        setError(err.message || 'Błąd podczas pobierania kierowców');
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, [searchName, searchSurname, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Dodawanie nowego kierowcy
  const handleAddDriver = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newDriver.name.trim() || !newDriver.surname.trim()) {
      setAddError('Wszystkie pola są wymagane.');
      return;
    }

    try {
      const createdDriver = await createNewDriver({
        name: newDriver.name.trim(),
        surname: newDriver.surname.trim(),
      });

      setDrivers([...drivers, createdDriver]);

      setNewDriver({ name: '', surname: '' });
    } catch (err) {
      console.error(err);
      setAddError(err.message || "Błąd podczas dodawania kierowcy");
    }
  };

  // Obsługa zmiany danych edytowanego kierowcy
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingDriver({ ...editingDriver, [name]: value });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError('');

    if (!editingDriver.name.trim() || !editingDriver.surname.trim()) {
      setSaveError('Wszystkie pola są wymagane.');
      setSaving(false);
      return;
    }

    try {
      const updatedDriver = await updateDriverById(editingDriver.id, {
        name: editingDriver.name.trim(),
        surname: editingDriver.surname.trim(),
      });

      setDrivers(drivers.map(d => (d.id === updatedDriver.id ? updatedDriver : d)));
      setEditingDriver(null);
    } catch (err) {
      setSaveError(err.message || 'Błąd podczas zapisywania zmian');
    } finally {
      setSaving(false);
    }
  };

  // Anulowanie edycji
  const handleCancelEdit = () => {
    setEditingDriver(null);
    setSaveError('');
  };

  // Obsługa usuwania kierowcy
  const handleDeleteDriver = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego kierowcę?')) {
      try {
        await deleteDriverById(id);
        setDrivers(drivers.filter(d => d.id !== id));
        if (editingDriver?.id === id) setEditingDriver(null);
      } catch (err) {
        alert(err.message || 'Błąd podczas usuwania kierowcy');
      }
    }
  };

  return (
    <div className="drivers-container">
      <h1>Lista Kierowców</h1>

      {/* Formularz dodawania */}
      <form onSubmit={handleAddDriver} className="add-driver-form">
        <div className="form-row">
          <label>
            Imię:
            <input
              type="text"
              value={newDriver.name}
              onChange={e => setNewDriver({ ...newDriver, name: e.target.value })}
              placeholder="Wpisz imię"
              required
            />
          </label>
          <label>
            Nazwisko:
            <input
              type="text"
              value={newDriver.surname}
              onChange={e => setNewDriver({ ...newDriver, surname: e.target.value })}
              placeholder="Wpisz nazwisko"
              required
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
        {addError && <p className="error">{addError}</p>}
      </form>

      {/* Filtry */}
      <div className="search-inputs" style={{ marginBottom: '1rem' }}>
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
      </div>

      {error && <p className="error">{error}</p>}

      {/* Tabela */}
      <div style={{ position: 'relative' }}>
        {drivers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Imię
                </th>
                <th
                  onClick={() => handleSort('surname')}
                  className={sortConfig.key === 'surname' ? `sort-${sortConfig.direction}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Nazwisko
                </th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map(driver => (
                <tr key={driver.id}>
                  <td>{driver.name}</td>
                  <td>{driver.surname}</td>
                  <td>
                    <button onClick={() => setEditingDriver(driver)} className="edit-button">Edytuj</button>
                    <button onClick={(e) => handleDeleteDriver(e, driver.id)} className="delete-button">×</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Brak wyników.</p>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Edycja */}
      {editingDriver && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Kierowcę</h2>
            <label>
              Imię:
              <input
                type="text"
                name="name"
                value={editingDriver.name}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Nazwisko:
              <input
                type="text"
                name="surname"
                value={editingDriver.surname}
                onChange={handleChangeEditing}
                required
              />
            </label>

            {saveError && <p className="error">{saveError}</p>}
            {saving && <p className="loading">Zapisywanie zmian...</p>}

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

export default Drivers;
