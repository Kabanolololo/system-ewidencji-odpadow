import { useState, useEffect } from 'react';
import { fetchAllContractorsWithStoredToken, createContractorOnline, createContractorOffline, updateContractorById, deleteContractorById } from '../../../api/Contractors';
import '../styles/Contractors.css';
import '../styles/Modals.css';

function Contractors() {
  
  const [contractors, setContractors] = useState([]);
  const [newContractor, setNewContractor] = useState({
    nip: '',
    regon: '',
    name: '',
    city: '',
    postalCode: '',
    street: '',
  });
  
  // Stan do przechowywania trybu online/offline
  const [isOnline, setIsOnline] = useState(false);

  // Stan do przechowywania wyszukiwania i sortowania
  const [search, setSearch] = useState({ nip: '', regon: '', name: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Stan do przechowywania edytowanego kontrahenta i błędów
  const [editingContractor, setEditingContractor] = useState(null);

  // Stany do obsługi błędów i ładowania
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addError, setAddError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadContractors = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllContractorsWithStoredToken({
          nip: search.nip,
          regon: search.regon,
          name: search.name,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
        });
        setContractors(data);
      } catch (err) {
        console.error('Błąd podczas pobierania kontrahentów:', err.message);
        setError(err.message || 'Błąd podczas pobierania kontrahentów');
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    loadContractors();
  }, [search, sortConfig]);

  // Obsługa sortowania
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Obsługa usuwania kontrahenta
  const handleDeleteContractor = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Czy na pewno chcesz usunąć tego kontrahenta?')) return;

    try {
      await deleteContractorById(id);
      setContractors((prev) => prev.filter(c => c.id !== id));
      if (editingContractor?.id === id) {
        setEditingContractor(null);
        setSaveError('');
      }
    } catch (err) {
      setError(`Błąd podczas usuwania kontrahenta: ${err.message}`);
    }
  };

  // Obsługa edycji kontrahenta
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingContractor({ ...editingContractor, [name]: value });
    setSaveError('');
  };

  // Obsługa zapisywania zmian w edycji kontrahenta
  const handleSaveEdit = async () => {
    setSaveError('');
    setSaving(true);

    if (!editingContractor.nip.trim() || !editingContractor.name.trim() || !editingContractor.address.trim()) {
      setSaveError('NIP, Nazwa i Adres są wymagane.');
      setSaving(false);
      return;
    }

    try {
      const updated = await updateContractorById(editingContractor.id, {
        nip: editingContractor.nip.trim(),
        regon: editingContractor.regon.trim(),
        name: editingContractor.name.trim(),
        address: editingContractor.address.trim(),
      });

      setContractors((prev) =>
        prev.map(c => (c.id === updated.id ? updated : c))
      );
      setEditingContractor(null);
    } catch (err) {
      setSaveError(err.message || 'Błąd podczas zapisywania zmian');
    } finally {
      setSaving(false);
    }
  };

  // Obsługa anulowania edycji kontrahenta
  const handleCancelEdit = () => {
    setEditingContractor(null);
    setSaveError('');
  };

  // Obsługa dodawania nowego kontrahenta
  const handleAddContractor = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newContractor.nip.trim()) {
      setAddError('NIP jest wymagany.');
      return;
    }
    // Sprawdzenie, czy tryb offline wymaga pełnych danych
    if (!isOnline) {
      if (!newContractor.regon.trim() || !newContractor.name.trim() || !newContractor.city.trim() || !newContractor.postalCode.trim() || !newContractor.street.trim()) {
        setAddError('Wszystkie pola są wymagane w trybie offline.');
        return;
      }
    }

    try {
      // Dodanie kontrahenta online
      if (isOnline) {
        const createdContractor = await createContractorOnline({ nip: newContractor.nip.trim() });
        setContractors(prev => [...prev, createdContractor]);
        
      // Dodanie kontrahenta offline
      } else {
        const address = `ul. ${newContractor.street.trim()}, ${newContractor.postalCode.trim()}, ${newContractor.city.trim()}`;
        const createdContractor = await createContractorOffline({
          nip: newContractor.nip.trim(),
          regon: newContractor.regon.trim(),
          name: newContractor.name.trim(),
          address,
        });
        setContractors(prev => [...prev, createdContractor]);
      }
      setNewContractor({ nip: '', regon: '', name: '', city: '', postalCode: '', street: '' });
    } catch (err) {
      setAddError(err.message || 'Błąd podczas dodawania kontrahenta');
    }
  };

  return (
    <div className="contractors-container">
      <h1>Lista Kontrahentów</h1>

      {/* Formularz dodawania kontrahenta */}
      <form onSubmit={handleAddContractor} className="add-contractor-form">
        <div className="mode-toggle-container">
          <div className="mode-toggle-label">Tryb dodawania:</div>
          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              setNewContractor({ nip: '', regon: '', name: '', city: '', postalCode: '', street: '' });
            }}
            className={isOnline ? 'mode-toggle-button active' : 'mode-toggle-button'}
          >
            {isOnline ? 'Online (tylko NIP)' : 'Offline (pełne dane)'}
          </button>
        </div>

        <div className="form-row">
          <label>
            NIP:
            <input
              type="text"
              placeholder="Wpisz NIP"
              value={newContractor.nip}
              onChange={e => setNewContractor({ ...newContractor, nip: e.target.value })}
              required
            />
          </label>

          {!isOnline && (
            <>
              <label>
                REGON:
                <input
                  type="text"
                  placeholder="Wpisz REGON"
                  value={newContractor.regon}
                  onChange={e => setNewContractor({ ...newContractor, regon: e.target.value })}
                  required
                />
              </label>

              <label>
                Nazwa firmy:
                <input
                  type="text"
                  placeholder="Wpisz nazwę firmy"
                  value={newContractor.name}
                  onChange={e => setNewContractor({ ...newContractor, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Miasto:
                <input
                  type="text"
                  placeholder="Wpisz miasto"
                  value={newContractor.city}
                  onChange={e => setNewContractor({ ...newContractor, city: e.target.value })}
                  required
                />
              </label>

              <label>
                Kod pocztowy:
                <input
                  type="text"
                  placeholder="Wpisz kod pocztowy"
                  value={newContractor.postalCode}
                  onChange={e => setNewContractor({ ...newContractor, postalCode: e.target.value })}
                  required
                />
              </label>

              <label>
                Ulica:
                <input
                  type="text"
                  placeholder="np. Marszałkowska 10"
                  value={newContractor.street}
                  onChange={e => setNewContractor({ ...newContractor, street: e.target.value })}
                  required
                />
              </label>
            </>
          )}
        </div>

        {addError && <p className="error">{addError}</p>}

        <button type="submit" className="add-button">
          Dodaj kontrahenta
        </button>
      </form>

      {/* Wyszukiwanie i sortowanie kontrahentów */}
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj NIP"
          value={search.nip}
          onChange={e => setSearch({ ...search, nip: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj REGON"
          value={search.regon}
          onChange={e => setSearch({ ...search, regon: e.target.value })}
        />
        <input
          type="text"
          placeholder="Szukaj nazwę"
          value={search.name}
          onChange={e => setSearch({ ...search, name: e.target.value })}
        />
      </div>

      {/* Tabela kontrahentów */}
      <div style={{ position: 'relative' }}>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="contractors-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nip')} className={sortConfig.key === 'nip' ? `sort-${sortConfig.direction}` : ''}>
                  NIP
                </th>
                <th onClick={() => handleSort('regon')} className={sortConfig.key === 'regon' ? `sort-${sortConfig.direction}` : ''}>
                  REGON
                </th>
                <th onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}>
                  Nazwa
                </th>
                <th>Adres</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {contractors.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', fontStyle: 'italic' }}>
                    Brak wyników
                  </td>
                </tr>
              ) : (
                contractors.map(contractor => (
                  <tr key={contractor.id}>
                    <td>{contractor.nip}</td>
                    <td>{contractor.regon}</td>
                    <td>{contractor.name}</td>
                    <td>{contractor.address}</td>
                    <td>
                      <button onClick={() => setEditingContractor(contractor)} className="edit-button" title="Edytuj">
                        Edytuj
                      </button>
                      <button onClick={(e) => handleDeleteContractor(e, contractor.id)} className="delete-button" title="Usuń">
                        ×
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
          </div>
        )}
      </div>

      { /* Edycja kontrahenta */}
      {editingContractor && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Kontrahenta</h2>
            <label>
              NIP:
              <input type="text" name="nip" value={editingContractor.nip} onChange={handleChangeEditing} required />
            </label>
            <label>
              REGON:
              <input type="text" name="regon" value={editingContractor.regon} onChange={handleChangeEditing} />
            </label>
            <label>
              Nazwa:
              <input type="text" name="name" value={editingContractor.name} onChange={handleChangeEditing} required />
            </label>
            <label>
              Adres:
              <input type="text" name="address" value={editingContractor.address} onChange={handleChangeEditing} required />
            </label>

            {saveError && <p className="error">{saveError}</p>}
            {saving && <p className="loading">Zapisywanie zmian...</p>}

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

export default Contractors;