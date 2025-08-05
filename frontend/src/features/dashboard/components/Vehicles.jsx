import { useState, useEffect } from 'react';
import { fetchAllVehiclesWithStoredToken, createNewVehicle, updateVehicleById, deleteVehicleById } from '../../../api/Vehicles';
import '../styles/Vehicles.css';
import '../styles/Modals.css';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stan do dodawania nowego pojazdu
  const [newVehicle, setNewVehicle] = useState({ registration: '', make: '', model: '' });
  const [addError, setAddError] = useState('');

  // Stany do wyszukiwania i sortowania
  const [searchRegistration, setSearchRegistration] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Stan do edycji pojazdu
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Mapowanie kluczy sortowania do backendowych
  const backendSortKeysMap = {
    registration: 'registration_number',
    make: 'brand',
    model: 'model',
  };

  // Ładowanie pojazdów z backendu
  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        // Mapowanie klucza sortowania do backendowego
        const backendSortKey = backendSortKeysMap[sortConfig.key] || '';

        const data = await fetchAllVehiclesWithStoredToken({
          registration_number: searchRegistration,
          sort_by: backendSortKey,
          sort_order: sortConfig.direction,
        });

        // Mapowanie danych z API do formatu zgodnego z frontendem
        const mappedVehicles = data.map(v => ({
          id: v.id,
          registration: v.registration_number,
          make: v.brand,
          model: v.model,
        }));

        setVehicles(mappedVehicles);
      } catch (err) {
        setError(err.message || 'Błąd podczas pobierania pojazdów');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [searchRegistration, sortConfig]);

  // Obsługa sortowania
  const allowedSortKeys = ['registration'];
  const handleSort = (key) => {
    if (!allowedSortKeys.includes(key)) {
      return;
    }

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Dodawanie nowego pojazdu
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newVehicle.registration.trim() || !newVehicle.make.trim() || !newVehicle.model.trim()) {
      setAddError('Wszystkie pola są wymagane.');
      return;
    }

    try {
      const createdVehicle = await createNewVehicle({
        registration_number: newVehicle.registration.trim(),
        brand: newVehicle.make.trim(),
        model: newVehicle.model.trim(),
      });

      setVehicles([...vehicles, {
        id: createdVehicle.id,
        registration: createdVehicle.registration_number,
        make: createdVehicle.brand,
        model: createdVehicle.model,
      }]);

      setNewVehicle({ registration: '', make: '', model: '' });
    } catch (err) {
      console.error(err);
      setAddError(err.message || "Błąd podczas dodawania pojazdu");
    }
  };

  // Usuwanie pojazdu
  const handleDeleteVehicle = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten pojazd?')) {
      try {
        await deleteVehicleById(id);
        setVehicles(vehicles.filter(v => v.id !== id));
        if (editingVehicle?.id === id) setEditingVehicle(null);
      } catch (err) {
        alert(err.message || 'Błąd podczas usuwania pojazdu');
      }
    }
  };

  // Obsługa zmiany danych edytowanego pojazdu
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingVehicle({ ...editingVehicle, [name]: value });
  };

  // Zapisanie zmian w edytowanym pojeździe
  const handleSaveEdit = async () => {
    setSaveError('');
    setSaving(true);

    if (
      !editingVehicle.registration.trim() ||
      !editingVehicle.make.trim() ||
      !editingVehicle.model.trim()
    ) {
      setSaveError('Wszystkie pola są wymagane.');
      setSaving(false);
      return;
    }

    try {
      const updatedVehicle = await updateVehicleById(editingVehicle.id, {
        registration_number: editingVehicle.registration.trim(),
        brand: editingVehicle.make.trim(),
        model: editingVehicle.model.trim(),
      });

      setVehicles(vehicles.map(v =>
        v.id === updatedVehicle.id
          ? {
              id: updatedVehicle.id,
              registration: updatedVehicle.registration_number,
              make: updatedVehicle.brand,
              model: updatedVehicle.model,
            }
          : v
      ));
      
      setEditingVehicle(null);
    } catch (err) {
      console.error(err);
      setSaveError(err.message || 'Błąd podczas zapisywania pojazdu');
    } finally {
      setSaving(false);
    }
  };

  // Anulowanie edycji
  const handleCancelEdit = () => {
    setEditingVehicle(null);
    setSaveError('');
  };

  return (
    <div className="vehicles-container">
      <h1>Lista Pojazdów</h1>

      {/* Formularz dodawania pojazdu */}
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
        {addError && <p className="error">{addError}</p>}
      </form>

      {/* Filtr po rejestracji */}
      <div className="search-inputs" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Szukaj po rejestracji"
          value={searchRegistration}
          onChange={e => setSearchRegistration(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {/* Tabela pojazdów */}
      <div style={{ position: 'relative' }}>
        {vehicles.length > 0 ? (
          <table className="vehicles-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort('registration')}
                  className={sortConfig.key === 'registration' ? `sort-${sortConfig.direction}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Numer rejestracyjny
                </th>
                <th
                  onClick={() => handleSort('make')}
                  className={sortConfig.key === 'make' ? `sort-${sortConfig.direction}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Marka
                </th>
                <th
                  onClick={() => handleSort('model')}
                  className={sortConfig.key === 'model' ? `sort-${sortConfig.direction}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Model
                </th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>{vehicle.registration}</td>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td>
                    <button
                      onClick={() => {
                        console.log('Edytowany pojazd:', vehicle);
                        setEditingVehicle(vehicle);
                      }}
                      className="edit-button"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={(e) => handleDeleteVehicle(e, vehicle.id)}
                      className="delete-button"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && !error && (
            <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Brak wyników.</p>
          )
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Modal edycji */}
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

export default Vehicles;