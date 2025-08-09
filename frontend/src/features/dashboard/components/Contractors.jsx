import { useState, useEffect } from 'react';
import {
  fetchAllContractorsWithStoredToken,
  createContractorOnline,
  createContractorOffline,
  updateContractorById,
  deleteContractorById,
} from '../../../api/Contractors';

import '../styles/Contractors.css';
import '../styles/Modals.css';

function Contractors() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newContractor, setNewContractor] = useState({
    nip: '',
    regon: '',
    name: '',
    city: '',
    postalCode: '',
    street: ''
  });
  const [addError, setAddError] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const [search, setSearch] = useState({
    nip: '',
    regon: '',
    name: ''
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [editingContractor, setEditingContractor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Ładowanie kontrahentów
  useEffect(() => {
    const loadContractors = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllContractorsWithStoredToken({
          ...search,
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
        });
        setContractors(data);
      } catch (err) {
        setError(err.message || 'Błąd podczas pobierania kontrahentów');
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };
    loadContractors();
  }, [search, sortConfig]);

  // Dodawanie kontrahenta
  const handleAddContractor = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newContractor.nip.trim()) {
      setAddError('NIP jest wymagany.');
      return;
    }
    if (!isOnline) {
      const { regon, name, city, postalCode, street } = newContractor;
      if (!regon.trim() || !name.trim() || !city.trim() || !postalCode.trim() || !street.trim()) {
        setAddError('Wszystkie pola są wymagane w trybie offline.');
        return;
      }
    }

    try {
      let created;
      if (isOnline) {
        created = await createContractorOnline({ nip: newContractor.nip.trim() });
      } else {
        const address = `ul. ${newContractor.street.trim()}, ${newContractor.postalCode.trim()}, ${newContractor.city.trim()}`;
        created = await createContractorOffline({
          nip: newContractor.nip.trim(),
          regon: newContractor.regon.trim(),
          name: newContractor.name.trim(),
          address,
        });
      }
      setContractors([...contractors, created]);
      setNewContractor({ nip: '', regon: '', name: '', city: '', postalCode: '', street: '' });
    } catch (err) {
      setAddError(err.message || 'Błąd podczas dodawania kontrahenta');
    }
  };

  // Sortowanie
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Edycja
  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingContractor({ ...editingContractor, [name]: value });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError('');
    const { nip, name, address } = editingContractor;
    if (!nip.trim() || !name.trim() || !address.trim()) {
      setSaveError('NIP, Nazwa i Adres są wymagane.');
      setSaving(false);
      return;
    }
    try {
      const updated = await updateContractorById(editingContractor.id, {
        nip: nip.trim(),
        regon: editingContractor.regon.trim(),
        name: name.trim(),
        address: address.trim(),
      });
      setContractors(contractors.map(c => (c.id === updated.id ? updated : c)));
      setEditingContractor(null);
    } catch (err) {
      setSaveError(err.message || 'Błąd podczas zapisu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingContractor(null);
    setSaveError('');
  };

  // Usuwanie
  const handleDeleteContractor = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć tego kontrahenta?')) {
      try {
        await deleteContractorById(id);
        setContractors(contractors.filter(c => c.id !== id));
        if (editingContractor?.id === id) setEditingContractor(null);
      } catch (err) {
        alert(err.message || 'Błąd podczas usuwania kontrahenta');
      }
    }
  };

  return (
    <div className="contractors-container">
      <h1>Lista Kontrahentów</h1>

      {/* Formularz dodawania */}
      <form onSubmit={handleAddContractor} className="add-contractor-form">
        <div className="mode-toggle-container">
          <div className="mode-toggle-label">Tryb dodawania:</div>
          <button type="button" onClick={() => setIsOnline(!isOnline)} className={isOnline ? 'mode-toggle-button active' : 'mode-toggle-button'}>
            {isOnline ? 'Online (tylko NIP)' : 'Offline (pełne dane)'}
          </button>
        </div>

        <div className="form-row">
          <label>NIP:
            <input type="text" value={newContractor.nip} onChange={e => setNewContractor({ ...newContractor, nip: e.target.value })} required />
          </label>

          {!isOnline && (
            <>
              <label>REGON:
                <input type="text" value={newContractor.regon} onChange={e => setNewContractor({ ...newContractor, regon: e.target.value })} required />
              </label>
              <label>Nazwa:
                <input type="text" value={newContractor.name} onChange={e => setNewContractor({ ...newContractor, name: e.target.value })} required />
              </label>
              <label>Miasto:
                <input type="text" value={newContractor.city} onChange={e => setNewContractor({ ...newContractor, city: e.target.value })} required />
              </label>
              <label>Kod pocztowy:
                <input type="text" value={newContractor.postalCode} onChange={e => setNewContractor({ ...newContractor, postalCode: e.target.value })} required />
              </label>
              <label>Ulica:
                <input type="text" value={newContractor.street} onChange={e => setNewContractor({ ...newContractor, street: e.target.value })} required />
              </label>
            </>
          )}
        </div>
        {addError && <p className="error">{addError}</p>}
        <button type="submit" className="add-button">Dodaj kontrahenta</button>
      </form>

      {/* Filtry */}
      <h2 className='filters-sorting'>Filtry i wyszukiwanie</h2>
      <div className="search-inputs">
        <input type="text" placeholder="Szukaj po NIP" value={search.nip} onChange={e => setSearch({ ...search, nip: e.target.value })} />
        <input type="text" placeholder="Szukaj po REGON" value={search.regon} onChange={e => setSearch({ ...search, regon: e.target.value })} />
        <input type="text" placeholder="Szukaj po nazwie" value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
      </div>

      {/* Tabela */}
      <div style={{ position: 'relative' }}>
        {contractors.length > 0 ? (
          <table className="contractors-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nip')} className={sortConfig.key === 'nip' ? `sort-${sortConfig.direction}` : ''}>NIP</th>
                <th onClick={() => handleSort('regon')} className={sortConfig.key === 'regon' ? `sort-${sortConfig.direction}` : ''}>REGON</th>
                <th onClick={() => handleSort('name')} className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}>Nazwa</th>
                <th className='dont-sort'>Adres</th>
                <th className='dont-sort'>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {contractors.map(c => (
                <tr key={c.id}>
                  <td>{c.nip}</td>
                  <td>{c.regon}</td>
                  <td>{c.name}</td>
                  <td>{c.address}</td>
                  <td>
                    <button onClick={() => setEditingContractor(c)} className="edit-button">Edytuj</button>
                    <button onClick={(e) => handleDeleteContractor(e, c.id)} className="delete-button">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : !loading && !error ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>Brak kontrahentów</p>
        ) : null}

        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Wczytywanie kontrahentów...</p>}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Edycja */}
      {editingContractor && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Kontrahenta</h2>
            <label>NIP:
              <input type="text" name="nip" value={editingContractor.nip} onChange={handleChangeEditing} required />
            </label>
            <label>REGON:
              <input type="text" name="regon" value={editingContractor.regon} onChange={handleChangeEditing} />
            </label>
            <label>Nazwa:
              <input type="text" name="name" value={editingContractor.name} onChange={handleChangeEditing} required />
            </label>
            <label>Adres:
              <input type="text" name="address" value={editingContractor.address} onChange={handleChangeEditing} required />
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

export default Contractors;
