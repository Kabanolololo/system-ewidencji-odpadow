import { useState, useEffect } from 'react';
import { fetchAllWastesWithStoredToken, createNewWaste, updateWasteById, deleteWasteById } from '../../../api/Waste';

import '../styles/Waste.css';
import '../styles/Modals.css';

function Waste() {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newWaste, setNewWaste] = useState({ code: '', name: '', notes: '' });
  const [addError, setAddError] = useState('');

  const [searchCode, setSearchCode] = useState('');
  const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null

  const [editingWaste, setEditingWaste] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Ładowanie danych
  useEffect(() => {
    async function loadWastes() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAllWastesWithStoredToken({
          code: searchCode,
          sort_by: sortOrder ? 'code' : null,
          sort_order: sortOrder,
        });
        setWastes(data);
      } catch (err) {
        setError(err.message || 'Błąd podczas pobierania odpadów');
        setWastes([]);
      } finally {
        setLoading(false);
      }
    }

    loadWastes();
  }, [searchCode, sortOrder]);

  const handleSort = () => {
    if (sortOrder === 'asc') setSortOrder('desc');
    else if (sortOrder === 'desc') setSortOrder(null);
    else setSortOrder('asc');
  };

  const handleAddWaste = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newWaste.code.trim() || !newWaste.name.trim()) {
      setAddError('Kod i nazwa są wymagane.');
      return;
    }

    try {
      const created = await createNewWaste({
        code: newWaste.code.trim(),
        name: newWaste.name.trim(),
        notes: newWaste.notes.trim(),
      });

      setWastes([...wastes, created]);
      setNewWaste({ code: '', name: '', notes: '' });
    } catch (err) {
      console.error(err);
      setAddError(err.message || 'Błąd podczas dodawania odpadu');
    }
  };

  const handleChangeEditing = (e) => {
    const { name, value } = e.target;
    setEditingWaste({ ...editingWaste, [name]: value });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError('');

    if (!editingWaste.code.trim() || !editingWaste.name.trim()) {
      setSaveError('Kod i nazwa są wymagane.');
      setSaving(false);
      return;
    }

    try {
      const updated = await updateWasteById(editingWaste.id, {
        code: editingWaste.code.trim(),
        name: editingWaste.name.trim(),
        notes: editingWaste.notes.trim(),
      });

      setWastes(wastes.map(w => (w.id === updated.id ? updated : w)));
      setEditingWaste(null);
    } catch (err) {
      setSaveError(err.message || 'Błąd podczas zapisu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingWaste(null);
    setSaveError('');
  };

  const handleDeleteWaste = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Czy na pewno chcesz usunąć ten odpad?')) {
      try {
        await deleteWasteById(id);
        setWastes(wastes.filter(w => w.id !== id));
        if (editingWaste?.id === id) setEditingWaste(null);
      } catch (err) {
        alert(err.message || 'Błąd podczas usuwania odpadu');
      }
    }
  };

  return (
    <div className="waste-container">
      <h1>Lista Odpadów</h1>

      {/* Formularz dodawania */}
      <form onSubmit={handleAddWaste} className="add-waste-form">
        <div className="form-row">
          <label>
            Kod:
            <input
              type="text"
              value={newWaste.code}
              onChange={e => setNewWaste({ ...newWaste, code: e.target.value })}
              placeholder="Wpisz kod"
              required
            />
          </label>
          <label>
            Nazwa:
            <input
              type="text"
              value={newWaste.name}
              onChange={e => setNewWaste({ ...newWaste, name: e.target.value })}
              placeholder="Wpisz nazwę"
              required
            />
          </label>
          <label>
            Notatki:
            <input
              type="text"
              value={newWaste.notes}
              onChange={e => setNewWaste({ ...newWaste, notes: e.target.value })}
              placeholder="Dodatkowe notatki"
            />
          </label>
        </div>
        <button type="submit" className="add-button">Dodaj</button>
        {addError && <p className="error">{addError}</p>}
      </form>

      {/* Filtr */}
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Szukaj po kodzie"
          value={searchCode}
          onChange={e => setSearchCode(e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Wczytywanie odpadów...</p>}


      {/* Tabela */}
      {wastes.length > 0 && !loading && (
        <div style={{ position: 'relative' }}>
          <table className="waste-table">
            <thead>
              <tr>
                <th
                  onClick={handleSort}
                  className={sortOrder ? `sort-${sortOrder}` : ''}
                  style={{ cursor: 'pointer' }}
                >
                  Kod odpadu
                </th>
                <th>Nazwa</th>
                <th>Notatki</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {wastes.map(w => (
                <tr key={w.id}>
                  <td>{w.code}</td>
                  <td>{w.name}</td>
                  <td>{w.notes}</td>
                  <td>
                    <button onClick={() => setEditingWaste(w)} className="edit-button">Edytuj</button>
                    <button onClick={(e) => handleDeleteWaste(e, w.id)} className="delete-button">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && wastes.length === 0 && (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}></p>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}


      {/* Edycja */}
      {editingWaste && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div className="edit-panel" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleCancelEdit}>×</button>
            <h2>Edytuj Odpad</h2>
            <label>
              Kod:
              <input
                type="text"
                name="code"
                value={editingWaste.code}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Nazwa:
              <input
                type="text"
                name="name"
                value={editingWaste.name}
                onChange={handleChangeEditing}
                required
              />
            </label>
            <label>
              Notatki:
              <input
                type="text"
                name="notes"
                value={editingWaste.notes}
                onChange={handleChangeEditing}
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

export default Waste;